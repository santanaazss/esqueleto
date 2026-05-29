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

    
  } catch (e) {
    enableDemoMode();
  }
}

function enableDemoMode() {
  IS_DEMO = true;

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
