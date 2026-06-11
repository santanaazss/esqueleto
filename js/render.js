/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Funções de Renderização
   ═══════════════════════════════════════════════════════════════ */

// ── Utilitários ────────────────────────────────────────────────────
function animate(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('pt-BR');
}

function statusBadge(status) {
  const map = {
    planejamento: ['blue',   'Planejamento'],
    aguardando:   ['amber',  'Aguardando'],
    producao:     ['purple', 'Em Produção'],
    qualidade:    ['blue',   'Controle QA'],
    concluido:    ['green',  'Concluído'],
    cancelado:    ['red',    'Cancelado']
  };
  const [cls, label] = map[status] || ['blue', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ── Dashboard ──────────────────────────────────────────────────────
function renderDashboard() {
  const m = STATE.metricas;
  animate('m-ordens',  m.ordensAtivas);
  animate('m-pecas',   m.pecasMes.toLocaleString('pt-BR'));
  animate('m-critico', m.itensCriticos);
  animate('m-alertas', m.alertasPendentes);

  document.getElementById('m-ordens-delta').textContent  = '↑ 3 novas hoje';
  document.getElementById('m-pecas-delta').textContent   = '↑ 8.2% vs mês anterior';
  document.getElementById('m-critico-delta').textContent = '⚠ Requer ação imediata';
  document.getElementById('m-alertas-delta').textContent = `${m.alertasPendentes} não resolvidos`;
  document.getElementById('lastSync').textContent        = new Date().toLocaleTimeString('pt-BR');

  // Gráfico de status
  const statusMap = { planejamento:0, aguardando:0, producao:0, qualidade:0, concluido:0, cancelado:0 };
  STATE.ordens.forEach(o => { if (statusMap[o.status] !== undefined) statusMap[o.status]++; });
  const statusNames  = { planejamento:'Planejamento', aguardando:'Aguardando Mat.', producao:'Em Produção', qualidade:'Controle Qualidade', concluido:'Concluído', cancelado:'Cancelado' };
  const statusColors = { planejamento:'var(--accent)', aguardando:'var(--amber)', producao:'var(--purple)', qualidade:'var(--green)', concluido:'#22c55e', cancelado:'var(--red)' };
  const total = STATE.ordens.length;

  document.getElementById('statusChart').innerHTML =
    Object.entries(statusMap).map(([k, v]) => `
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:14px;color:var(--text-secondary);width:140px">${statusNames[k]}</span>
        <div style="flex:1;background:var(--border);border-radius:2px;height:6px;overflow:hidden">
          <div style="height:100%;width:${total ? Math.round(v/total*100) : 0}%;background:${statusColors[k]};border-radius:2px;transition:width 0.5s"></div>
        </div>
        <span style="font-size:14px;font-family:var(--mono);color:var(--text-muted);width:20px;text-align:right">${v}</span>
      </div>`).join('');

  // Feed de atividades
  const activities = [
    ...STATE.ordens.slice(0,4).map(o => ({ ts: o.criado, txt: `Ordem ${o.id} criada por ${o.responsavel}`, cor: 'var(--accent)' })),
    ...STATE.alertas.filter(a => a.ativo).map(a => ({ ts: Date.now()-3600000, txt: a.titulo, cor: 'var(--red)' }))
  ].sort((a,b) => b.ts - a.ts).slice(0, 8);

  document.getElementById('activityFeed').innerHTML = activities.map(a => `
    <div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="width:6px;height:6px;border-radius:50%;background:${a.cor};margin-top:5px;flex-shrink:0"></div>
      <span style="font-size:15px;color:var(--text-secondary);flex:1">${a.txt}</span>
    </div>`).join('');

  // Tabela de ordens recentes
  document.getElementById('dashTableBody').innerHTML = STATE.ordens.slice(0,6).map(o => `
    <tr>
      <td style="font-family:var(--mono);font-size:12px;color:var(--accent)">${o.id}</td>
      <td style="color:var(--text-primary)">${o.produto}</td>
      <td style="font-family:var(--mono)">${Number(o.qty).toLocaleString('pt-BR')}</td>
      <td>${o.responsavel}</td>
      <td>${statusBadge(o.status)}</td>
      <td style="font-family:var(--mono)">${formatDate(o.prazo)}</td>
    </tr>`).join('');
}

// ── Kanban ─────────────────────────────────────────────────────────
function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  board.innerHTML = KANBAN_COLS.map(col => {
    const cards = STATE.ordens.filter(o => o.status === col.id);
    return `
      <div class="kanban-col" ondragover="event.preventDefault()" ondrop="dropCard(event,'${col.id}')">
        <div class="kanban-header">
          <div class="kanban-title">
            <div class="kanban-dot" style="background:${col.color}"></div>
            ${col.label}
          </div>
          <div class="kanban-count">${cards.length}</div>
        </div>
        <div class="kanban-body">
          ${cards.map(c => `
            <div class="kanban-card" draggable="true"
              ondragstart="dragStart(event,'${c.id}')"
              onclick="viewOrdem('${c.id}')">
              <div class="kc-id">${c.id}</div>
              <div class="kc-title">${c.produto}</div>
              <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">
                ${Number(c.qty).toLocaleString('pt-BR')} peças · ${c.responsavel}
              </div>
              <div class="kc-meta">
                <span class="kc-prio ${c.prio}">${c.prio.charAt(0).toUpperCase()+c.prio.slice(1)}</span>
                <span class="kc-date"> ${formatDate(c.prazo)}</span>
              </div>
            </div>`).join('')}
        </div>
        <div class="kanban-add" onclick="openAddOrdem('${col.id}')">+ Adicionar</div>
      </div>`;
  }).join('');

  document.getElementById('kanbanBadge').textContent =
    STATE.ordens.filter(o => !['concluido','cancelado'].includes(o.status)).length;
}

// ── Estoque ────────────────────────────────────────────────────────
function renderEstoque() {
  document.getElementById('estoqueBadge').textContent =
    STATE.estoque.filter(i => i.qty < i.min).length;

  document.getElementById('estoqueGrid').innerHTML = STATE.estoque.map(item => {
    const pct     = Math.min(100, Math.round(item.qty / item.max * 100));
    const isCrit  = item.qty < item.min;
    const isLow   = !isCrit && item.qty < item.min * 1.5;
    const barColor = isCrit ? 'var(--red)' : isLow ? 'var(--amber)' : 'var(--green)';
    return `
      <div class="item-card ${isCrit?'critical':isLow?'low':''}">
        <div class="item-name">${item.nome}</div>
        <div class="item-cat">${item.cat}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${barColor}"></div>
        </div>
        <div class="item-qty">
         
          <span style="color:var(--text-muted)">mín: ${item.min} / máx: ${item.max}</span>
        </div>
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn" style="font-size:13px;padding:4px 8px;flex:1" onclick="ajustarEstoque('${item.id}','entrada')">+ Entrada</button>
          <button class="btn" style="font-size:13px;padding:4px 8px;flex:1" onclick="ajustarEstoque('${item.id}','saida')">− Saída</button>
        </div>
      </div>`;
  }).join('');
}

// ── Fornecedores ───────────────────────────────────────────────────
function renderFornecedores() {
  document.getElementById('fornecedoresBody').innerHTML = STATE.fornecedores.map(f => `
    <tr>
      <td style="color:var(--text-primary);font-weight:500">${f.nome}</td>
      <td style="font-family:var(--mono);font-size:12px">${f.cnpj}</td>
      <td>${f.cat}</td>
      <td style="font-family:var(--mono)">${f.lead}</td>
      <td><span class="badge ${f.status==='ativo'?'green':'red'}">${f.status.charAt(0).toUpperCase()+f.status.slice(1)}</span></td>
      <td>
        <button class="btn" style="font-size:13px;padding:4px 8px" onclick="toggleFornecedor('${f.id}')">
          ${f.status==='ativo'?'Suspender':'Reativar'}
        </button>
      </td>
    </tr>`).join('');
}

// ── Alertas ────────────────────────────────────────────────────────
function renderAlertas() {
  document.getElementById('alertList').innerHTML = STATE.alertas.map(a => `
    <div class="alert-item" style="${!a.ativo?'opacity:0.5':''}">
      <div class="alert-icon ${a.tipo}">
        ${a.tipo==='red'?'':a.tipo==='amber'?'':''}
      </div>
      <div class="alert-body">
        <div class="alert-title">${a.titulo}</div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-time">${a.time}</div>
        ${a.ativo ? `<div class="alert-actions">
          <button class="alert-btn" onclick="resolveAlert('${a.id}')">Resolver</button>
          <button class="alert-btn" onclick="snoozeAlert('${a.id}')"> Adiar</button>
        </div>` : '<div class="alert-time" style="color:var(--green)">✓ Resolvido</div>'}
      </div>
    </div>`).join('');
}

// ── Chat sidebar ───────────────────────────────────────────────────
function renderChatSidebar() {
  const crit  = STATE.estoque.filter(i => i.qty < i.min);
  const ativas = STATE.ordens.filter(o => !['concluido','cancelado'].includes(o.status));
  document.getElementById('chatSidebar').innerHTML = `
    <div style="background:var(--bg-elevated);border-radius:8px;padding:12px">
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">ESTOQUE CRÍTICO</div>
      ${crit.length === 0
        ? '<div style="font-size:14px;color:var(--green)">Nenhum item crítico</div>'
        : crit.map(i => `<div style="font-size:14px;color:var(--red);margin-bottom:4px">• ${i.nome}: ${i.qty}/${i.min}</div>`).join('')}
    </div>
    <div style="background:var(--bg-elevated);border-radius:8px;padding:12px">
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">ORDENS ATIVAS</div>
      <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--accent)">${ativas.length}</div>
      <div style="font-size:13px;color:var(--text-muted)">de ${STATE.ordens.length} ordens</div>
    </div>
    <div style="background:var(--bg-elevated);border-radius:8px;padding:12px">
      <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px">ALERTAS ATIVOS</div>
      <div style="font-size:22px;font-weight:600;font-family:var(--mono);color:var(--red)">${STATE.alertas.filter(a=>a.ativo).length}</div>
    </div>`;
}

// ── renderAll ──────────────────────────────────────────────────────
function renderAll() {
  STATE.metricas.ordensAtivas     = STATE.ordens.filter(o => !['concluido','cancelado'].includes(o.status)).length;
  STATE.metricas.itensCriticos    = STATE.estoque.filter(i => i.qty < i.min).length;
  STATE.metricas.alertasPendentes = STATE.alertas.filter(a => a.ativo).length;
  updateBadges();
  renderDashboard();
  renderKanban();
  renderEstoque();
  renderAlertas();
  initChat();
}
