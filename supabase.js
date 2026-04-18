var SUPABASE_URL = 'https://xtcmvbzjcpewivhnvvwz.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Y212YnpqY3Bld2l2aG52dnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MzA1MjYsImV4cCI6MjA5MjEwNjUyNn0.axsQZ8vxLaO_6LXlgVjaQSK8qGjHfu5f7MqOG7bgWgc';

var sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
var appInitialized = false;

function initAuth() {
  sbClient.auth.onAuthStateChange(function(event, session) {
    if (session) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('main-app').style.display = '';
      document.getElementById('main-nav').style.display = '';
      if (!appInitialized) {
        appInitialized = true;
        try { init(); } catch(e) {
          document.querySelector('.app').innerHTML =
            '<div style="padding:2rem;color:#ff6b6b;font-family:monospace;font-size:.8rem;background:#0e1220;border-radius:12px;border:1px solid #ff6b6b33"><strong>Erreur JS :</strong><br>' +
            e.message + '<br><br>' + (e.stack || '') + '</div>';
        }
      }
    } else {
      document.getElementById('login-screen').style.display = 'flex';
      document.getElementById('main-app').style.display = 'none';
      document.getElementById('main-nav').style.display = 'none';
    }
  });
}

function sendMagicLink() {
  var email = document.getElementById('login-email').value.trim();
  if (!email) {
    document.getElementById('login-email').focus();
    return;
  }
  var btn = document.getElementById('login-btn');
  btn.textContent = 'Envoi en cours...';
  btn.disabled = true;

  sbClient.auth.signInWithOtp({
    email: email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  }).then(function(result) {
    if (result.error) {
      btn.textContent = 'Erreur — r\u00e9essaie';
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
