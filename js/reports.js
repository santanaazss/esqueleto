/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Relatórios
   ═══════════════════════════════════════════════════════════════ */

function generateReport(tipo) {
  const out  = document.getElementById('reportOutput');
  const data = new Date().toLocaleDateString('pt-BR');
  out.style.display = 'block';

  const reports = {
    producao: `
      <div class="card-title">Relatório de Produção — ${data}</div>
      <div class="metrics-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="metric-card green">
          <div class="metric-label">Ordens Concluídas</div>
          <div class="metric-value">${STATE.ordens.filter(o=>o.status==='concluido').length}</div>
        </div>
        <div class="metric-card blue">
          <div class="metric-label">Em Produção</div>
          <div class="metric-value">${STATE.ordens.filter(o=>o.status==='producao').length}</div>
        </div>
        <div class="metric-card amber">
          <div class="metric-label">Taxa de Conclusão</div>
          <div class="metric-value">${Math.round(STATE.ordens.filter(o=>o.status==='concluido').length/STATE.ordens.length*100)}%</div>
        </div>
      </div>`,

    estoque: `
      <div class="card-title">Relatório de Estoque — ${data}</div>
      <div class="metrics-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="metric-card blue">
          <div class="metric-label">Total de Itens</div>
          <div class="metric-value">${STATE.estoque.length}</div>
        </div>
        <div class="metric-card red">
          <div class="metric-label">Críticos</div>
          <div class="metric-value">${STATE.estoque.filter(i=>i.qty<i.min).length}</div>
        </div>
        <div class="metric-card amber">
          <div class="metric-label">Abaixo de 50%</div>
          <div class="metric-value">${STATE.estoque.filter(i=>i.qty/i.max<0.5).length}</div>
        </div>
      </div>`,

    fornecedores: `
      <div class="card-title">Performance de Fornecedores — ${data}</div>
      <div class="metrics-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="metric-card green">
          <div class="metric-label">Ativos</div>
          <div class="metric-value">${STATE.fornecedores.filter(f=>f.status==='ativo').length}</div>
        </div>
        <div class="metric-card red">
          <div class="metric-label">Suspensos</div>
          <div class="metric-value">${STATE.fornecedores.filter(f=>f.status==='suspenso').length}</div>
        </div>
        <div class="metric-card blue">
          <div class="metric-label">Total Cadastrados</div>
          <div class="metric-value">${STATE.fornecedores.length}</div>
        </div>
      </div>`
  };

  out.innerHTML = reports[tipo] || '';
  out.scrollIntoView({ behavior: 'smooth' });
}
