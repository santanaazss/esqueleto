/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Configurações e Constantes
   ═══════════════════════════════════════════════════════════════ */

// ── Firebase Config ────────────────────────────────────────────────
// INSTRUÇÕES: Substitua com as credenciais do seu projeto Firebase
// Console: https://console.firebase.google.com
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCpI_mjogp94WUuM4EzNmctvNZVJbsy7QA",
  authDomain: "projetoo-57172.firebaseapp.com",
  databaseURL: "https://projetoo-57172-default-rtdb.firebaseio.com",
  projectId: "projetoo-57172",
  storageBucket: "projetoo-57172.firebasestorage.app",
  messagingSenderId: "1070958822066",
  appId: "1:1070958822066:web:c55b2433149b1e71dbffab"
};
// ── Usuários demo ──────────────────────────────────────────────────
const DEMO_USERS = {
  "admin@sigml.com.br":    { password: "123456", name: "Administrador", role: "admin" },
  "operador@sigml.com.br": { password: "123456", name: "Operador",      role: "operador" }
};

// ── Colunas do Kanban ──────────────────────────────────────────────
const KANBAN_COLS = [
  { id: 'planejamento', label: 'Planejamento',    color: '#3b82f6' },
  { id: 'aguardando',   label: 'Aguardando Mat.', color: '#f59e0b' },
  { id: 'producao',     label: 'Em Produção',     color: '#a855f7' },
  { id: 'qualidade',    label: 'Controle QA',     color: '#22c55e' },
  { id: 'concluido',    label: 'Concluído',       color: '#6ee7b7' },
];

// ── Intents do chatbot ─────────────────────────────────────────────
const BOT_INTENTS = {
  estoque: () => {
    const criticos = STATE.estoque.filter(i => i.qty < i.min);
    if (criticos.length === 0)
      return 'Todos os itens de estoque estão dentro dos níveis mínimos. Ótima gestão! 📦';
    return ` **${criticos.length} item(ns) em nível crítico:**\n\n${criticos.map(i => `• **${i.nome}**: ${i.qty}/${i.min} ${i.unidade}`).join('\n')}\n\nRecomendo acionar os fornecedores imediatamente.`;
  },
  ordens: () => {
    const ativas = STATE.ordens.filter(o => !['concluido','cancelado'].includes(o.status));
    const alta   = ativas.filter(o => o.prio === 'alta');
    return ` **Ordens em andamento:** ${ativas.length}\n🔴 Alta prioridade: ${alta.length}\n\n${alta.slice(0,3).map(o => `• ${o.id}: ${o.produto} (${o.status})`).join('\n')}`;
  },
  alertas: () => {
    const pend = STATE.alertas.filter(a => a.ativo);
    if (pend.length === 0) return 'Nenhum alerta ativo no momento. Sistema operando normalmente ✅';
    return ` **${pend.length} alerta(s) pendente(s):**\n\n${pend.map(a => `• ${a.titulo}`).join('\n')}`;
  },
  metricas: () =>
    ` **Métricas do dia:**\n• Ordens ativas: ${STATE.metricas.ordensAtivas}\n• Peças produzidas (mês): ${STATE.metricas.pecasMes.toLocaleString('pt-BR')}\n• Itens críticos: ${STATE.metricas.itensCriticos}\n• Alertas pendentes: ${STATE.metricas.alertasPendentes}`,
  ajuda: () =>
    ' Posso ajudar com:\n• **estoque** — verificar níveis e alertas\n• **ordens** — status das ordens de produção\n• **alertas** — alertas pendentes\n• **métricas** — indicadores do sistema\n• **fornecedores** — status dos fornecedores',
  fornecedores: () => {
    const susp = STATE.fornecedores.filter(f => f.status === 'suspenso');
    return ` **Fornecedores:** ${STATE.fornecedores.length} cadastrados\n⛔ Suspensos: ${susp.length}${susp.length ? '\n' + susp.map(f => `• ${f.nome}`).join('\n') : ''}`;
  }
};

const QUICK_REPLIES = ['Estoque crítico?', 'Ordens ativas', 'Ver alertas', 'Métricas do dia', 'Ajuda'];
