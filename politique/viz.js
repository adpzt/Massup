/* ============================================================
   MODULE POLITIQUE — visualisations SVG (window.POLV)
   Fonctions PURES : (données) → chaîne SVG. Aucune animation, aucun
   timer, aucun listener : rendu une fois, zéro coût batterie.
   Convention : score 0 = droite (bleu) · 10 = gauche (rouge).
   ============================================================ */
(function () {
  'use strict';
  var POL = window.POL;
  var S = POL.SECTIONS, L = POL.SECTION_LABELS, COL = POL.SECTION_COLORS;
  var SHORT = { eco: 'Éco', social: 'Social', immigration: 'Immigr.', securite: 'Sécurité', env: 'Environ.', europe: 'Europe', institutions: 'Instit.', societal: 'Société', education: 'Éduc.' };
  // Couleurs via variables CSS → suivent le thème clair / sombre (var() accepté dans les attributs SVG inline)
  var RED = 'var(--pol-left)', BLUE = 'var(--pol-right)', INK = 'var(--pol-txt)', MUT = 'var(--pol-mut)', LINE = 'var(--pol-line-2)';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function r1(n) { return Math.round(n * 10) / 10; }
  function ini(name) { var p = name.trim().split(/\s+/); return ((p[0] || '')[0] || '') + (p.length > 1 ? (p[p.length - 1][0] || '') : ''); }

  // ── Radar d'ACCORD : pour chaque thème, 10 - |toi - candidat| (10 = accord total) ──
  // series : [{ values:{theme:0..10}, color, label }] (1 à 3 séries)
  function radar(series, opts) {
    opts = opts || {};
    var W = 320, cx = 160, cy = 165, R = 108, n = S.length;
    function pt(i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + Math.cos(a) * R * v / 10, cy + Math.sin(a) * R * v / 10]; }
    var g = '';
    [2.5, 5, 7.5, 10].forEach(function (lv) {
      var pts = []; for (var i = 0; i < n; i++) pts.push(pt(i, lv).join(','));
      g += '<polygon points="' + pts.join(' ') + '" fill="' + (lv === 10 ? 'var(--pol-bg-2)' : 'none') + '" stroke="' + LINE + '" stroke-width="' + (lv === 10 ? 1.2 : .7) + '"/>';
    });
    for (var i = 0; i < n; i++) { var p = pt(i, 10); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + r1(p[0]) + '" y2="' + r1(p[1]) + '" stroke="' + LINE + '" stroke-width=".7"/>'; }
    var polys = '';
    series.forEach(function (s, k) {
      var pts = [];
      for (var i = 0; i < n; i++) { var v = s.values[S[i]]; if (v == null) v = 0; pts.push(pt(i, Math.max(0, Math.min(10, v))).map(r1).join(',')); }
      polys += '<polygon points="' + pts.join(' ') + '" fill="' + s.color + '" fill-opacity="' + (k === 0 ? .22 : .12) + '" stroke="' + s.color + '" stroke-width="2" stroke-linejoin="round"/>';
      for (var j = 0; j < n; j++) { var v2 = s.values[S[j]]; if (v2 == null) continue; var q = pt(j, v2); polys += '<circle cx="' + r1(q[0]) + '" cy="' + r1(q[1]) + '" r="3" fill="' + s.color + '"/>'; }
    });
    var labels = '';
    for (var m = 0; m < n; m++) {
      var lp = pt(m, 12.4); var anchor = Math.abs(lp[0] - cx) < 8 ? 'middle' : (lp[0] < cx ? 'end' : 'start');
      labels += '<text x="' + r1(lp[0]) + '" y="' + r1(lp[1] + 3) + '" text-anchor="' + anchor + '" font-size="10" font-weight="700" fill="' + COL[S[m]] + '">' + esc(SHORT[S[m]]) + '</text>';
    }
    var legend = '';
    series.forEach(function (s, k) { legend += '<g transform="translate(' + (10 + k * 105) + ',' + (W - 6) + ')"><rect x="0" y="-9" width="10" height="10" rx="2" fill="' + s.color + '"/><text x="14" y="0" font-size="9.5" font-weight="700" fill="' + INK + '">' + esc(s.label || '') + '</text></g>'; });
    // Direction A 01/09 : +24px de marge pour que les libellés (« Immig. ») ne soient plus coupés
    return '<svg class="pol-svg" viewBox="-24 -12 ' + (W + 48) + ' ' + (W + 42) + '" role="img" aria-label="' + esc(opts.title || 'Radar d\'accord par thème') + '">' + g + polys + labels + legend + '</svg>';
  }

  // ── Boussole politique 2D ──
  // points : [{ x:0..10 (score éco : 10 = gauche), y:0..10 (score société : 10 = ouvert), color, name, me, dim }]
  function compass(points, opts) {
    opts = opts || {};
    var W = 330, H = 330, P = 26, iw = W - 2 * P, ih = H - 2 * P;
    function X(v) { return P + (10 - v) / 10 * iw; }   // gauche (10) à GAUCHE
    function Y(v) { return P + (10 - v) / 10 * ih; }   // ouvert (10) en HAUT
    // Direction A2 (01/09 soir) : boussole apaisée — juste les deux axes centraux,
    // seuls les candidats > 8 % portent leurs initiales, les autres sont des points.
    var s = '<rect x="' + P + '" y="' + P + '" width="' + iw + '" height="' + ih + '" rx="12" fill="var(--pol-surface-2)" stroke="' + LINE + '"/>';
    s += '<line x1="' + r1(X(5)) + '" y1="' + P + '" x2="' + r1(X(5)) + '" y2="' + (H - P) + '" stroke="' + LINE + '" stroke-width="1.2"/>';
    s += '<line x1="' + P + '" y1="' + r1(Y(5)) + '" x2="' + (W - P) + '" y2="' + r1(Y(5)) + '" stroke="' + LINE + '" stroke-width="1.2"/>';
    // légendes des axes
    s += '<text x="' + P + '" y="' + (P - 9) + '" font-size="9.5" font-weight="800" fill="' + RED + '">◀ Gauche éco · redistribution</text>';
    s += '<text x="' + (W - P) + '" y="' + (P - 9) + '" text-anchor="end" font-size="9.5" font-weight="800" fill="' + BLUE + '">marché · Droite éco ▶</text>';
    s += '<text x="' + (W / 2) + '" y="' + (P + 12) + '" text-anchor="middle" font-size="9" font-weight="700" fill="' + MUT + '">▲ Progressiste · ouverture</text>';
    s += '<text x="' + (W / 2) + '" y="' + (H - P - 5) + '" text-anchor="middle" font-size="9" font-weight="700" fill="' + MUT + '">▼ Conservateur · autorité</text>';
    // candidats (non-moi d'abord, moi au-dessus)
    var others = points.filter(function (p) { return !p.me; }), me = points.filter(function (p) { return p.me; });
    others.forEach(function (p) {
      var x = r1(X(p.x)), y = r1(Y(p.y)), rad = p.big ? 11 : 4.5;
      s += '<g opacity="' + (p.dim ? .3 : (p.big ? 1 : .75)) + '"><title>' + esc(p.name) + ' — éco ' + r1(p.x) + '/10 · société ' + r1(p.y) + '/10</title>' +
        '<circle cx="' + x + '" cy="' + y + '" r="' + rad + '" fill="' + p.color + '" stroke="var(--pol-surface)" stroke-width="1.5"/>' +
        (p.big ? '<text x="' + x + '" y="' + (y + 3) + '" text-anchor="middle" font-size="8" font-weight="800" fill="#fff">' + esc(ini(p.name)) + '</text>' : '') + '</g>';
    });
    me.forEach(function (p) {
      var x = r1(X(p.x)), y = r1(Y(p.y));
      s += '<g><title>Toi — éco ' + r1(p.x) + '/10 · société ' + r1(p.y) + '/10</title>' +
        '<circle cx="' + x + '" cy="' + y + '" r="15" fill="var(--pol-surface)" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + INK + '"/>' +
        '<text x="' + x + '" y="' + (y - 20) + '" text-anchor="middle" font-size="10" font-weight="800" fill="' + INK + '">TOI</text></g>';
    });
    return '<svg class="pol-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Boussole politique">' + s + '</svg>';
  }

  // ── Courbe d'évolution du score global (0 droite → 10 gauche) ──
  // pts : [{ label, y }] du plus ancien au plus récent
  function lineChart(pts, opts) {
    opts = opts || {};
    var W = 330, H = 150, PL = 30, PR = 30, PT = 14, PB = 26, iw = W - PL - PR, ih = H - PT - PB;
    var n = pts.length;
    function X(i) { return n === 1 ? PL + iw / 2 : PL + i * iw / (n - 1); }
    function Y(v) { return PT + (10 - v) / 10 * ih; }
    var s = '<defs><linearGradient id="polLgy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + RED + '" stop-opacity=".10"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="' + BLUE + '" stop-opacity=".10"/></linearGradient></defs>';
    s += '<rect x="' + PL + '" y="' + PT + '" width="' + iw + '" height="' + ih + '" rx="8" fill="url(#polLgy)" stroke="' + LINE + '"/>';
    [0, 2.5, 5, 7.5, 10].forEach(function (v) {
      s += '<line x1="' + PL + '" y1="' + r1(Y(v)) + '" x2="' + (W - PR) + '" y2="' + r1(Y(v)) + '" stroke="' + LINE + '" stroke-width="' + (v === 5 ? 1.3 : .6) + '"/>';
      s += '<text x="' + (PL - 5) + '" y="' + r1(Y(v) + 3) + '" text-anchor="end" font-size="8.5" fill="' + MUT + '" font-weight="700">' + v + '</text>';
    });
    s += '<text x="' + (PL - 5) + '" y="' + (PT + 2) + '" text-anchor="end" font-size="7.5" fill="' + RED + '" font-weight="800"></text>';
    var path = pts.map(function (p, i) { return (i ? 'L' : 'M') + r1(X(i)) + ' ' + r1(Y(p.y)); }).join(' ');
    if (n > 1) s += '<path d="' + path + '" fill="none" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach(function (p, i) {
      var c = POL.positionLabel(p.y).color;
      s += '<circle cx="' + r1(X(i)) + '" cy="' + r1(Y(p.y)) + '" r="5" fill="' + c + '" stroke="var(--pol-surface)" stroke-width="2"><title>' + esc(p.label) + ' — ' + r1(p.y) + '/10</title></circle>';
      if (n <= 8 || i === 0 || i === n - 1) s += '<text x="' + r1(X(i)) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="8.5" fill="' + MUT + '" font-weight="700">' + esc(p.label) + '</text>';
      if (n <= 6) s += '<text x="' + r1(X(i)) + '" y="' + r1(Y(p.y) - 9) + '" text-anchor="middle" font-size="9" fill="' + INK + '" font-weight="800">' + r1(p.y) + '</text>';
    });
    return '<svg class="pol-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Évolution de ta position">' + s + '</svg>';
  }

  // ── Barres horizontales (sondages, etc.) : rows [{label, value, color, sub, range:[min,max]}] ──
  function hbars(rows, opts) {
    opts = opts || {};
    var W = 330, rowH = 26, PL = 118, PR = 44, iw = W - PL - PR, H = rows.length * rowH + 8;
    var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r.range ? r.range[1] : r.value; })) || 1;
    var s = '';
    rows.forEach(function (r, i) {
      var y = 4 + i * rowH, w = Math.max(2, r.value / max * iw);
      s += '<text x="' + (PL - 8) + '" y="' + (y + 15) + '" text-anchor="end" font-size="10.5" font-weight="700" fill="' + INK + '">' + esc(r.label) + '</text>';
      s += '<rect x="' + PL + '" y="' + (y + 5) + '" width="' + iw + '" height="14" rx="7" fill="var(--pol-bg-2)"/>';
      if (r.range) { var a = r.range[0] / max * iw, b = r.range[1] / max * iw; s += '<rect x="' + r1(PL + a) + '" y="' + (y + 5) + '" width="' + r1(Math.max(2, b - a)) + '" height="14" rx="7" fill="' + r.color + '" fill-opacity=".22"/>'; }
      s += '<rect x="' + PL + '" y="' + (y + 5) + '" width="' + r1(w) + '" height="14" rx="7" fill="' + r.color + '"/>';
      s += '<text x="' + r1(PL + w + 6) + '" y="' + (y + 16) + '" font-size="10.5" font-weight="800" fill="' + INK + '">' + esc(r.text || (r.value + '%')) + '</text>';
    });
    return '<svg class="pol-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.title || 'Barres') + '">' + s + '</svg>';
  }

  // ── Histogramme vertical : bins [{label, n, color}] ──
  function hist(bins, opts) {
    opts = opts || {};
    var W = 330, H = 120, PB = 24, PT = 16, n = bins.length, gap = 10, bw = (W - gap * (n + 1)) / n;
    var max = Math.max.apply(null, bins.map(function (b) { return b.n; })) || 1;
    var s = '';
    bins.forEach(function (b, i) {
      var h = (H - PT - PB) * b.n / max, x = gap + i * (bw + gap), y = H - PB - h;
      s += '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(bw) + '" height="' + r1(h) + '" rx="6" fill="' + (b.color || '#1B4DE4') + '"/>';
      s += '<text x="' + r1(x + bw / 2) + '" y="' + r1(y - 4) + '" text-anchor="middle" font-size="10" font-weight="800" fill="' + INK + '">' + b.n + '</text>';
      s += '<text x="' + r1(x + bw / 2) + '" y="' + (H - 7) + '" text-anchor="middle" font-size="9" font-weight="700" fill="' + MUT + '">' + esc(b.label) + '</text>';
    });
    return '<svg class="pol-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.title || 'Histogramme') + '">' + s + '</svg>';
  }

  // ── Écarts signés par thème : rows [{theme, diff}] · diff = candidat − toi (score) ──
  // diff > 0 : le candidat est plus à GAUCHE que toi → barre vers la gauche (rouge)
  function diffBars(rows) {
    var W = 330, rowH = 22, PL = 70, PR = 10, iw = W - PL - PR, cx = PL + iw / 2, H = rows.length * rowH + 6;
    var s = '<line x1="' + r1(cx) + '" y1="2" x2="' + r1(cx) + '" y2="' + (H - 2) + '" stroke="' + INK + '" stroke-width="1.2"/>';
    rows.forEach(function (r, i) {
      var y = 3 + i * rowH, w = Math.min(1, Math.abs(r.diff) / 10) * (iw / 2);
      var left = r.diff > 0, col = Math.abs(r.diff) <= 1 ? 'var(--pol-ok)' : (left ? RED : BLUE);
      s += '<text x="' + (PL - 6) + '" y="' + (y + 14) + '" text-anchor="end" font-size="9.5" font-weight="700" fill="' + COL[r.theme] + '">' + esc(SHORT[r.theme]) + '</text>';
      s += '<rect x="' + r1(left ? cx - w : cx) + '" y="' + (y + 4) + '" width="' + r1(Math.max(2, w)) + '" height="12" rx="4" fill="' + col + '" fill-opacity=".85"/>';
      s += '<text x="' + r1(left ? cx - w - 4 : cx + w + 4) + '" y="' + (y + 14) + '" text-anchor="' + (left ? 'end' : 'start') + '" font-size="9" font-weight="800" fill="' + INK + '">' + (r.diff > 0 ? '+' : '') + r1(r.diff) + '</text>';
    });
    return '<svg class="pol-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Écarts par thème">' + s + '</svg>';
  }

  // ── Anneau de complétion ──
  function ring(pct, label, color) {
    var R = 26, C = 2 * Math.PI * R, off = C * (1 - Math.max(0, Math.min(1, pct)));
    return '<svg class="pol-ring" viewBox="0 0 64 64" role="img" aria-label="' + esc(label) + '"><circle cx="32" cy="32" r="' + R + '" fill="none" stroke="var(--pol-bg-2)" stroke-width="7"/>' +
      '<circle cx="32" cy="32" r="' + R + '" fill="none" stroke="' + (color || '#1B4DE4') + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + r1(C) + '" stroke-dashoffset="' + r1(off) + '" transform="rotate(-90 32 32)"/>' +
      '<text x="32" y="36" text-anchor="middle" font-size="13" font-weight="800" fill="' + INK + '">' + Math.round(pct * 100) + '%</text></svg>';
  }

  window.POLV = { radar: radar, compass: compass, lineChart: lineChart, hbars: hbars, hist: hist, diffBars: diffBars, ring: ring, SHORT: SHORT };
})();
