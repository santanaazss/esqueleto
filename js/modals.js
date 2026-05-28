/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Modais e Formulários
   ═══════════════════════════════════════════════════════════════ */

let addingToColumn = null;

// ── Modal: Nova Ordem ──────────────────────────────────────────────
function openAddOrdem(col) {
  addingToColumn = col || 'planejamento';
  document.getElementById('f-prazo').valueAsDate = new Date(Date.now() + 7 * 86400000);
  document.getElementById('modalOrdem').classList.add('open');
}

function createOrdem() {
  const produto = document.getElementById('f-produto').value;
  const qty     = parseInt(document.getElementById('f-qty').value);
  const resp    = document.getElementById('f-resp').value;
  const prio    = document.getElementById('f-prio').value;
  const prazo   = document.getElementById('f-prazo').value;

  if (!produto || !qty || !resp) { alert('Preencha todos os campos.'); return; }

  const num  = String(STATE.ordens.length + 1).padStart(3, '0');
  const nova = {
    id:          `OP-2025-${num}`,
    produto, qty, responsavel: resp, prio,
    status: addingToColumn || 'planejamento',
    prazo,
    criado: Date.now()
  };
  STATE.ordens.unshift(nova);

  if (!IS_DEMO && DB) DB.ref('ordens/' + nova.id.replace(/-/g,'_')).set(nova);

  STATE.metricas.ordensAtivas =
    STATE.ordens.filter(o => !['concluido','cancelado'].includes(o.status)).length;

  closeModal('modalOrdem');
  renderKanban();
  renderDashboard();
}

// ── Modal: Novo Item de Estoque ────────────────────────────────────
function openAddItem() {
  document.getElementById('modalItem').classList.add('open');
}

function createItem() {
  const nome = document.getElementById('fi-nome').value;
  const cat  = document.getElementById('fi-cat').value;
  const qty  = parseInt(document.getElementById('fi-qty').value);
  const min  = parseInt(document.getElementById('fi-min').value);
  const max  = parseInt(document.getElementById('fi-max').value);

  if (!nome || !qty || !min || !max) { alert('Preencha todos os campos.'); return; }

  const id       = 'EST-' + String(STATE.estoque.length + 1).padStart(3, '0');
  const sku      = nome.substring(0,3).toUpperCase() + '-' + Math.floor(Math.random()*9000+1000);
  const novoItem = { id, sku, nome, cat, qty, min, max, unidade: 'un' };
  STATE.estoque.push(novoItem);

  if (!IS_DEMO && DB) DB.ref('estoque/' + id).set(novoItem);

  checkEstoqueAlerts();
  closeModal('modalItem');
  renderEstoque();
  renderDashboard();
}

// ── Fechar modal ───────────────────────────────────────────────────
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
