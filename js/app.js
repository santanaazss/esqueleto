/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Aplicação principal (navegação, drag & drop, init)
   ═══════════════════════════════════════════════════════════════ */

// ── Navegação ──────────────────────────────────────────────────────
function navigate(view) {
  document.querySelectorAll('.view').forEach(v     => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.getElementById('nav-'  + view).classList.add('active');

  if (view === 'chatbot')       renderChatSidebar();
  if (view === 'fornecedores')  renderFornecedores();
  if (view === 'relatorios')    document.getElementById('reportOutput').style.display = 'none';
}

// ── Drag & drop Kanban ─────────────────────────────────────────────
let draggedId = null;

function dragStart(e, id) {
  draggedId = id;
  e.dataTransfer.effectAllowed = 'move';
}

function dropCard(e, newStatus) {
  e.preventDefault();
  if (!draggedId) return;
  const ordem = STATE.ordens.find(o => o.id === draggedId);
  if (!ordem) return;
  ordem.status = newStatus;
  if (!IS_DEMO && DB)
    DB.ref('ordens/' + ordem.id.replace(/-/g,'_')).update({ status: newStatus });
  renderKanban();
  renderDashboard();
  draggedId = null;
}

function viewOrdem(id) {
  const o = STATE.ordens.find(x => x.id === id);
  if (!o) return;
  alert(`Ordem: ${o.id}\nProduto: ${o.produto}\nQuantidade: ${o.qty}\nResponsável: ${o.responsavel}\nStatus: ${o.status}\nPrazo: ${formatDate(o.prazo)}`);
}

// ── Simulação de tempo real (modo demo) ───────────────────────────
function startRealtimeSimulation() {
  setInterval(() => {
    STATE.metricas.pecasMes += Math.floor(Math.random() * 5);
    document.getElementById('lastSync').textContent = new Date().toLocaleTimeString('pt-BR');
    const active = document.querySelector('.view.active');
    if (active && active.id === 'view-dashboard') renderDashboard();
  }, 30000);
}

// ── Forçar atualização ─────────────────────────────────────────────
function forceRefresh() {
  seedDemoData();
  renderAll();
}

// ── Configurações ──────────────────────────────────────────────────
function saveFirebaseConfig() {
  const proj = document.getElementById('cfg-project').value;
  const db   = document.getElementById('cfg-db').value;
  const key  = document.getElementById('cfg-key').value;
  if (proj && db && key) {
    alert('Configurações salvas. Recarregue a página para reconectar ao Firebase.');
  } else {
    alert('Preencha todos os campos.');
  }
}

function saveAlertConfig() {
  alert('Configurações de alerta salvas com sucesso.');
}

// ── Inicialização ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  // Fechar modais clicando fora
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  initFirebase();
});
