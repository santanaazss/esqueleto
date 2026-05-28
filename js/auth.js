/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Autenticação
   ═══════════════════════════════════════════════════════════════ */

let currentUser = null;

// ── Login ──────────────────────────────────────────────────────────
function doLogin() {
  const email    = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');

  // Autenticação real via Firebase Auth
  if (!IS_DEMO && AUTH) {
    AUTH.signInWithEmailAndPassword(email, password)
      .then(uc => { currentUser = uc.user; mountApp(); })
      .catch(() => { errEl.style.display = 'block'; });
    return;
  }

  // Autenticação local (modo demo)
  const u = DEMO_USERS[email];
  if (u && u.password === password) {
    currentUser = { email, name: u.name, role: u.role };
    const initials = u.name.split(' ').map(w => w[0]).join('').substring(0, 2);
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('userName').textContent   = u.name;
    mountApp();
  } else {
    errEl.style.display = 'block';
  }
}

// ── Logout ─────────────────────────────────────────────────────────
function doLogout() {
  if (!IS_DEMO && AUTH) AUTH.signOut();
  currentUser = null;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('appShell').style.display    = 'none';
}

// ── Monta a aplicação após login ───────────────────────────────────
function mountApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display    = 'grid';
  seedDemoData();
  renderAll();
  startRealtimeSimulation();
}
