/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Gestão de Alertas e Estoque
   ═══════════════════════════════════════════════════════════════ */

// ── Alertas ────────────────────────────────────────────────────────
function resolveAlert(id) {
  const a = STATE.alertas.find(x => x.id === id);
  if (a) { a.ativo = false; a.time = 'resolvido agora'; }
  if (!IS_DEMO && DB) DB.ref('alertas/' + id).update({ ativo: false });
  STATE.metricas.alertasPendentes = STATE.alertas.filter(x => x.ativo).length;
  updateBadges();
  renderAlertas();
  renderDashboard();
}

function snoozeAlert(id) {
  alert('Alerta adiado para 2 horas.');
}

function clearAllAlerts() {
  STATE.alertas.forEach(a => { a.ativo = false; });
  if (!IS_DEMO && DB)
    STATE.alertas.forEach(a => DB.ref('alertas/' + a.id).update({ ativo: false }));
  STATE.metricas.alertasPendentes = 0;
  updateBadges();
  renderAlertas();
  renderDashboard();
}

// ── Badges ─────────────────────────────────────────────────────────
function updateBadges() {
  const pend = STATE.alertas.filter(a => a.ativo).length;
  document.getElementById('alertBadge').textContent  = pend;
  document.getElementById('alertCount').textContent  = pend;
  document.getElementById('estoqueBadge').textContent =
    STATE.estoque.filter(i => i.qty < i.min).length;
}

// ── Verificação de estoque crítico ─────────────────────────────────
function checkEstoqueAlerts() {
  STATE.estoque.forEach(item => {
    if (item.qty < item.min) {
      const key = 'ALT-EST-' + item.id;
      if (!STATE.alertas.find(a => a.id === key)) {
        const newAlert = {
          id:    key,
          tipo:  'red',
          titulo:`Estoque Crítico: ${item.nome}`,
          desc:  `Quantidade atual (${item.qty} ${item.unidade}) abaixo do mínimo (${item.min} ${item.unidade}).`,
          time:  'agora',
          ativo: true
        };
        STATE.alertas.unshift(newAlert);
        if (!IS_DEMO && DB) DB.ref('alertas/' + key).set(newAlert);
      }
    }
  });
  STATE.metricas.itensCriticos    = STATE.estoque.filter(i => i.qty < i.min).length;
  STATE.metricas.alertasPendentes = STATE.alertas.filter(a => a.ativo).length;
  updateBadges();
}

// ── Ajuste de estoque ──────────────────────────────────────────────
function ajustarEstoque(id, tipo) {
  const item = STATE.estoque.find(i => i.id === id);
  if (!item) return;
  const qtd = parseInt(prompt(`Quantidade para ${tipo === 'entrada' ? 'entrada' : 'saída'} de ${item.nome}:`) || '0');
  if (isNaN(qtd) || qtd <= 0) return;
  if (tipo === 'entrada') item.qty += qtd;
  else item.qty = Math.max(0, item.qty - qtd);
  if (!IS_DEMO && DB) DB.ref('estoque/' + id).update({ qty: item.qty });
  checkEstoqueAlerts();
  renderEstoque();
  renderDashboard();
}

// ── Fornecedores ───────────────────────────────────────────────────
function toggleFornecedor(id) {
  const f = STATE.fornecedores.find(x => x.id === id);
  if (!f) return;
  f.status = f.status === 'ativo' ? 'suspenso' : 'ativo';
  if (!IS_DEMO && DB) DB.ref('fornecedores/' + id).update({ status: f.status });
  renderFornecedores();
}
