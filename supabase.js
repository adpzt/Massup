var SUPABASE_URL = 'https://xtcmvbzjcpewivhnvvwz.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';

var sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
var appInitialized = false;

// ─────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────
function initAuth() {
  sbClient.auth.onAuthStateChange(function(event, session) {
    if (session) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('main-app').style.display = '';
      document.getElementById('main-nav').style.display = '';
      if (!appInitialized) {
        appInitialized = true;
        bootWithSync();
      }
    } else {
      document.getElementById('login-screen').style.display = 'flex';
      document.getElementById('main-app').style.display = 'none';
      document.getElementById('main-nav').style.display = 'none';
    }
  });
}

function bootWithSync() {
  var done = false;
  var timeout = setTimeout(function() {
    if (!done) { done = true; bootApp(); }
  }, 4000);

  syncFromSupabase().then(function() {
    clearTimeout(timeout);
    if (!done) { done = true; bootApp(); }
  });
}

function bootApp() {
  try { init(); } catch(e) {
    document.getElementById('main-app').style.display = 'block';
    document.querySelector('.app').innerHTML =
      '<div style="padding:2rem;color:#ff6b6b;font-family:monospace;font-size:.8rem;background:#0e1220;border-radius:12px;border:1px solid #ff6b6b33"><strong>Erreur JS :</strong><br>' +
      e.message + '<br><br>' + (e.stack || '') + '</div>';
  }
}

function sendMagicLink() {
  var email = document.getElementById('login-email').value.trim();
  if (!email) { document.getElementById('login-email').focus(); return; }
  var btn = document.getElementById('login-btn');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;
  sbClient.auth.signInWithOtp({
    email: email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  }).then(function(result) {
    if (result.error) {
      btn.textContent = 'Erreur \u2014 r\u00e9essaie';
      btn.disabled = false;
    } else {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('login-sent').style.display = 'block';
    }
  });
}

function signOut() {
  sbClient.auth.signOut();
}

function loginOnEnter(e) {
  if (e.key === 'Enter') sendMagicLink();
}

// ─────────────────────────────────────────────────
// SYNC : Supabase → localStorage → app
// ─────────────────────────────────────────────────
async function syncFromSupabase() {
  try {
    var userRes = await sbClient.auth.getUser();
    var userId = userRes.data && userRes.data.user && userRes.data.user.id;
    if (!userId) return;

    loadDB(); // charge localStorage dans DB avant de comparer

    var results = await Promise.all([
      sbClient.from('weight_history')
        .select('exercise_id,weight,recorded_at')
        .eq('user_id', userId)
        .order('recorded_at'),
      sbClient.from('workout_sessions')
        .select('id,date,time,sessions,comment')
        .eq('user_id', userId)
        .order('date', { ascending: false })
    ]);

    var wData = results[0].data;
    var sData = results[1].data;
    var hasRemote = (wData && wData.length > 0) || (sData && sData.length > 0);

    if (hasRemote) {
      // Supabase a des données → il gagne
      if (wData && wData.length > 0) {
        var rw = {};
        var rwd = {};
        wData.forEach(function(r) {
          if (!rw[r.exercise_id]) rw[r.exercise_id] = [];
          rw[r.exercise_id].push({ date: r.recorded_at, val: parseFloat(r.weight) });
          rwd[r.exercise_id] = r.recorded_at;
        });
        // weightSetDate = dernière date connue par exercice
        Object.keys(rw).forEach(function(k) {
          var arr = rw[k];
          rwd[k] = arr[arr.length - 1].date;
        });
        DB.weights = rw;
        DB.weightSetDate = rwd;
      }
      if (sData && sData.length > 0) {
        DB.logs = sData.map(function(s) {
          return {
            id: s.id,
            date: s.date,
            time: s.time || '',
            sessions: s.sessions || [],
            comment: s.comment || ''
          };
        });
      }
      // Mettre à jour localStorage avec les données cloud
      try { localStorage.setItem('massup_db', JSON.stringify(DB)); } catch(e) {}
    } else {
      // Supabase vide → migration depuis localStorage
      _doSyncToSupabase(userId);
    }
  } catch(e) {
    console.warn('[MASSUP] syncFromSupabase failed, localStorage used:', e.message);
  }
}

// ─────────────────────────────────────────────────
// SYNC : localStorage → Supabase (debounced)
// ─────────────────────────────────────────────────
var _syncTimer = null;
function syncToSupabase() {
  if (!appInitialized) return;
  clearTimeout(_syncTimer);
  _syncTimer = setTimeout(function() {
    sbClient.auth.getUser().then(function(res) {
      var userId = res.data && res.data.user && res.data.user.id;
      if (userId) _doSyncToSupabase(userId);
    });
  }, 1500);
}

function _doSyncToSupabase(userId) {
  // ── Poids par exercice ──
  var wRows = [];
  Object.keys(DB.weights).forEach(function(exoId) {
    DB.weights[exoId].forEach(function(entry) {
      wRows.push({
        user_id: userId,
        exercise_id: exoId,
        weight: entry.val,
        recorded_at: entry.date
      });
    });
  });
  if (wRows.length) {
    sbClient.from('weight_history')
      .upsert(wRows, { onConflict: 'user_id,exercise_id,recorded_at' })
      .then(function() {})
      .catch(function(e) { console.warn('[MASSUP] weights upsert:', e.message); });
  }

  // ── Séances ──
  if (DB.logs.length) {
    var sRows = DB.logs.map(function(l) {
      return {
        id: l.id,
        user_id: userId,
        date: l.date,
        time: l.time || null,
        sessions: l.sessions || [],
        comment: l.comment || null
      };
    });
    sbClient.from('workout_sessions')
      .upsert(sRows, { onConflict: 'id' })
      .then(function() {
        // Supprimer les séances effacées localement
        var ids = DB.logs.map(function(l) { return l.id; });
        sbClient.from('workout_sessions')
          .delete()
          .eq('user_id', userId)
          .not('id', 'in', '(' + ids.join(',') + ')')
          .then(function() {})
          .catch(function() {});
      })
      .catch(function(e) { console.warn('[MASSUP] sessions upsert:', e.message); });
  } else {
    // Plus aucune séance → tout supprimer côté Supabase
    sbClient.from('workout_sessions')
      .delete()
      .eq('user_id', userId)
      .then(function() {})
      .catch(function() {});
  }
}
