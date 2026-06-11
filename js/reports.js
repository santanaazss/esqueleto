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
// Variável de controle para saber qual relatório está ativo
let currentReportType = '';
let currentReportData = [];
let currentReportHeaders = [];

/**
 * Carrega os dados na tabela antes da exportação
 */
function loadReportData(type) {
  currentReportType = type;
  const container = document.getElementById('reportOutput');
  const title = document.getElementById('reportTitle');
  const thead = document.getElementById('reportTableHead');
  const tbody = document.getElementById('reportTableBody');
  
  container.style.display = 'block';
  tbody.innerHTML = '';
  
  if (type === 'producao') {
    title.innerText = "Relatório de Produtividade e Ordens de Produção";
    currentReportHeaders = ["Cód. OP", "Item / Produto", "Qtd", "Operador", "Status", "Prazo"];
    
    // Tenta buscar da tabela principal do seu sistema ou usa mock estruturado
    currentReportData = window.currentOrdensList || [
      {id: "OP-2026-001", item: "Flange Aço ABNT 1020", qty: 500, resp: "Carlos Mendes", status: "Aguardando Mat.", prazo: "17/06/2026"},
      {id: "OP-2026-002", item: "Eixo Vazado 420mm", qty: 120, resp: "Ana Souza", status: "Controle QA", prazo: "11/06/2026"},
      {id: "OP-2026-003", item: "Porca Sextavada M16 Inox", qty: 2000, resp: "Fernanda Reis", status: "Em Produção", prazo: "24/06/2026"}
    ];
    
    thead.innerHTML = `<tr>${currentReportHeaders.map(h => `<th>${h}</th>`).join('')}</tr>`;
    tbody.innerHTML = currentReportData.map(row => `
      <tr>
        <td><strong>${row.id || row.code || 'N/A'}</strong></td>
        <td>${row.item || row.produto}</td>
        <td>${row.qty || row.quantidade}</td>
        <td>${row.resp || row.operador}</td>
        <td>${row.status}</td>
        <td>${row.prazo || row.dataLimite}</td>
      </tr>
    `).join('');

  } else if (type === 'estoque') {
    title.innerText = "Relatório Geral de Giro e Níveis de Estoque";
    currentReportHeaders = ["Insumo / Componente", "Categoria", "Qtd Atual", "Qtd Mínima", "Status"];
    
    currentReportData = window.currentEstoqueList || [
      {nome: "Bucha Bronze SAE 660", cat: "Componentes", qtd: 350, min: 100, status: "Normal"},
      {nome: "Chapa Perfurada 3mm", cat: "Chapas e Perfis", qtd: 12, min: 50, status: "Crítico"},
      {nome: "Chaveta Paralela DIN 6885", cat: "Fixadores", qtd: 600, min: 200, status: "Normal"}
    ];
    
    thead.innerHTML = `<tr>${currentReportHeaders.map(h => `<th>${h}</th>`).join('')}</tr>`;
    tbody.innerHTML = currentReportData.map(row => `
      <tr>
        <td>${row.nome}</td>
        <td>${row.cat || row.categoria}</td>
        <td>${row.qtd}</td>
        <td>${row.min}</td>
        <td><span style="color: ${row.qtd < row.min ? 'var(--red)' : 'var(--green)'}">${row.qtd < row.min ? 'Abaixo do Mínimo' : 'Regular'}</span></td>
      </tr>
    `).join('');

  } else if (type === 'fornecedores') {
    title.innerText = "Relatório de Performance e Lead Time de Fornecedores";
    currentReportHeaders = ["Parceiro Comercial", "Linha de Fornecimento", "Lead Time", "OTIF (%)", "Status"];
    
    currentReportData = [
      {nome: "Metalúrgica Gerdau S.A.", linha: "Aços e Perfis", lead: "5 dias", otif: "98.2%", status: "Ativo"},
      {nome: "Suprimentos Industriais Alfa", linha: "Fixadores e EPIs", lead: "3 dias", otif: "94.5%", status: "Em Revisão"},
      {nome: "Eletro Componentes Brasil", linha: "Painéis e Fiação", lead: "12 dias", lead: "89.0%", status: "Ativo"}
    ];
    
    thead.innerHTML = `<tr>${currentReportHeaders.map(h => `<th>${h}</th>`).join('')}</tr>`;
    tbody.innerHTML = currentReportData.map(row => `
      <tr>
        <td><strong>${row.nome}</strong></td>
        <td>${row.linha}</td>
        <td>${row.lead}</td>
        <td>${row.otif || '95%'}</td>
        <td>${row.status}</td>
      </tr>
    `).join('');
  }
}

/**
 * EXPORTAR EXCEL (Utilizando SheetJS)
 */
function exportToExcel() {
  if (!currentReportData.length) return;
  
  // Transforma a tabela HTML diretamente em uma planilha estruturada
  const table = document.getElementById("reportTable");
  const wb = XLSX.utils.table_to_book(table, { sheet: "Relatório SIGML" });
  
  // Salva o arquivo gerado
  XLSX.writeFile(wb, `sigml_relatorio_${currentReportType}_${new Date().toISOString().slice(0,10)}.xlsx`);
}

/**
 * EXPORTAR PDF (Utilizando jsPDF + AutoTable)
 */
function exportToPDF() {
  if (!currentReportData.length) return;
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Configuração básica do Tema Corporativo no PDF
  doc.setFillColor(18, 24, 38); // Fundo escuro para o Header do PDF (opcional)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("SIGML 4.0 — Relatório Gerencial", 14, 20);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 27);
  doc.text(`Módulo: ${document.getElementById('reportTitle').innerText}`, 14, 33);
  
  // Linha divisória gráfica
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 37, 196, 37);
  
  // Captura e monta a tabela estruturada automaticamente
  doc.autoTable({
    html: '#reportTable',
    startY: 42,
    theme: 'striped',
    headStyles: { fillColor: [43, 54, 76], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3 },
    margin: { left: 14, right: 14 }
  });
  
  // Realiza o Download direto no navegador
  doc.save(`sigml_relatorio_${currentReportType}.pdf`);
}