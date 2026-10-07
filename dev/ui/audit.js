// Audit exécuté DANS la page (page.evaluate) : contraste WCAG AA + débordements, sur la zone visible.
// Repris de l'audit du mode clair du 07/10/2026, complété par la détection de débordement.
module.exports = function audit() {
  const W = innerWidth, H = innerHeight;
  function parse(c) { const m = c && c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
  function over(t, b) { const a = t.a + b.a * (1 - t.a); if (!a) return { r: 0, g: 0, b: 0, a: 0 }; return { r: (t.r * t.a + b.r * b.a * (1 - t.a)) / a, g: (t.g * t.a + b.g * b.a * (1 - t.a)) / a, b: (t.b * t.a + b.b * b.a * (1 - t.a)) / a, a }; }
  function lum(c) { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); }
  function ratio(a, b) { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); }
  function layer(el) {
    const cs = getComputedStyle(el); let col = parse(cs.backgroundColor) || { r: 0, g: 0, b: 0, a: 0 };
    if (cs.backgroundImage && cs.backgroundImage.includes('gradient')) {
      const gs = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []).map(parse).filter(Boolean);
      if (gs.length) { const n = gs.length, s = gs.reduce((a, g) => ({ r: a.r + g.r, g: a.g + g.g, b: a.b + g.b, a: a.a + g.a }), { r: 0, g: 0, b: 0, a: 0 }); col = over({ r: s.r / n, g: s.g / n, b: s.b / n, a: Math.min(1, s.a / n) }, col); }
    }
    return col;
  }
  function bgOf(el) {
    const L = []; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const l = layer(e); if (l.a > 0) L.push(l); if (l.a >= .98) break; }
    let base = parse(getComputedStyle(document.body).backgroundColor);
    if (!base || base.a < 1) base = matchMedia('(prefers-color-scheme: dark)').matches ? { r: 11, g: 13, b: 18, a: 1 } : { r: 238, g: 241, b: 246, a: 1 };
    for (let i = L.length - 1; i >= 0; i--) base = over(L[i], base); return base;
  }
  function sel(el) {
    const one = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
    return (el.parentElement ? one(el.parentElement) + ' > ' : '') + one(el);
  }
  function visible(el, r) {
    if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > H) return false;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return false;
    let op = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) op *= +getComputedStyle(e).opacity;
    return op >= .05 ? op : false;
  }
  // un ancêtre qui coupe ou fait défiler horizontalement = débordement voulu (carrousel, puces)
  function clippedX(el) { for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) { const o = getComputedStyle(e).overflowX; if (o !== 'visible') return true; } return false; }

  const contrast = [], overflow = [], clipped = [], seen = new Set();
  if (document.documentElement.scrollWidth > W + 1) overflow.push({ sel: 'html', why: 'défilement horizontal de la page : largeur ' + document.documentElement.scrollWidth + ' px > ' + W + ' px' });
  document.querySelectorAll('body *').forEach(el => {
    if (/^(SCRIPT|STYLE|svg|path|BR|OPTION)$/.test(el.tagName)) return;
    const r = el.getBoundingClientRect(); const op = visible(el, r); if (!op) return;
    const cs = getComputedStyle(el);
    const txt = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').trim();
    // Débordement hors de l'écran
    if ((r.right > W + 1 || r.left < -1) && cs.position !== 'fixed' && !clippedX(el) && !/translate|matrix/.test(cs.transform)) {
      const k = 'o' + sel(el); if (!seen.has(k)) { seen.add(k); overflow.push({ sel: sel(el), why: 'sort de l’écran (' + Math.round(r.left) + '→' + Math.round(r.right) + ' px)', txt: txt.slice(0, 30) }); }
    }
    // Débordement de son conteneur (carte, bouton…) : texte ou bouton qui dépasse d'un parent qui a un fond ou une bordure
    if ((txt || el.tagName === 'BUTTON') && cs.position !== 'absolute' && cs.position !== 'fixed') {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ps = getComputedStyle(p); const boxed = (parse(ps.backgroundColor) || { a: 0 }).a > 0 || parseFloat(ps.borderLeftWidth) > 0 || ps.backgroundImage !== 'none';
        if (!boxed) continue;
        if (ps.overflowX !== 'visible') break;
        const pr = p.getBoundingClientRect();
        if (r.right > pr.right + 2 || r.left < pr.left - 2) { const k = 'c' + sel(el); if (!seen.has(k)) { seen.add(k); overflow.push({ sel: sel(el), why: 'dépasse de son conteneur ' + sel(p).split(' > ').pop() + ' de ' + Math.round(Math.max(r.right - pr.right, pr.left - r.left)) + ' px', txt: txt.slice(0, 30) }); } }
        break;
      }
    }
    if (!txt) return;
    // Texte coupé sans points de suspension
    if (cs.overflowX !== 'visible' && cs.textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
      const k = 't' + sel(el); if (!seen.has(k)) { seen.add(k); clipped.push({ sel: sel(el), txt: txt.slice(0, 40) }); }
    }
    // Contraste (l'élément doit être au premier plan à son centre)
    if (r.right < 0 || r.left > W) return;
    const cx = Math.min(W - 1, Math.max(0, r.left + r.width / 2)), cy = Math.min(H - 1, Math.max(0, r.top + Math.min(r.height / 2, 10)));
    const top = document.elementFromPoint(cx, cy); if (top && !(el.contains(top) || top.contains(el))) return;
    let fg = parse(cs.color); if (!fg) return;
    const fill = parse(cs.webkitTextFillColor); if (fill && fill.a === 0) return; // texte en dégradé : non mesurable
    const bg = bgOf(el); fg = over({ ...fg, a: fg.a * op }, bg);
    const cr = ratio(fg, bg), fs = parseFloat(cs.fontSize);
    const need = (fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700)) ? 3 : 4.5;
    if (cr < need) { const k = 'k' + sel(el) + cs.color; if (seen.has(k)) return; seen.add(k);
      contrast.push({ ratio: +cr.toFixed(2), need, sel: sel(el), txt: txt.slice(0, 40), color: cs.color, bg: `rgb(${bg.r | 0},${bg.g | 0},${bg.b | 0})`, fs: cs.fontSize }); }
  });
  return { contrast: contrast.sort((a, b) => a.ratio - b.ratio), overflow, clipped };
};
