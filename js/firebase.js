/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Integração Firebase
   ═══════════════════════════════════════════════════════════════ */

let DB      = null;
let AUTH    = null;
let IS_DEMO = true;

// ── Inicialização ──────────────────────────────────────────────────
function initFirebase() {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    DB   = firebase.database();
    AUTH = firebase.auth();

    const connRef = DB.ref('.info/connected');
    connRef.on('value', snap => {
      if (snap.val() === true) {
        IS_DEMO = false;
        document.getElementById('fbDot').className       = 'fb-dot connected';
        document.getElementById('fbStatusLabel').textContent = 'Firebase: conectado';
        document.getElementById('fbStatusText').textContent  = 'Firebase conectado';
        syncFromFirebase();
      } else {
        enableDemoMode();
      }
    });
  } catch (e) {
    enableDemoMode();
  }
}

function enableDemoMode() {
  IS_DEMO = true;
  document.getElementById('fbDot').className           = 'fb-dot demo';
  document.getElementById('fbStatusLabel').textContent = 'Firebase: modo demo (configure credenciais)';
  document.getElementById('fbStatusText').textContent  = 'Modo demo ativo';
}

// ── Sincronização em tempo real ────────────────────────────────────
function syncFromFirebase() {
  if (!DB) return;

  DB.ref('ordens').on('value', snap => {
    const data = snap.val();
    if (data) STATE.ordens = Object.values(data);
    renderAll();
  });

  DB.ref('estoque').on('value', snap => {
    const data = snap.val();
    if (data) STATE.estoque = Object.values(data);
    checkEstoqueAlerts();
    renderEstoque();
  });

  DB.ref('alertas').on('value', snap => {
    const data = snap.val();
    if (data) STATE.alertas = Object.values(data);
    renderAlertas();
  });
}

// ── Escrita genérica (no-op em demo) ──────────────────────────────
function fbWrite(path, data) {
  if (!IS_DEMO && DB) {
    DB.ref(path).set(data);
  }
}
