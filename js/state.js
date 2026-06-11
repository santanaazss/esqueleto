/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Estado da aplicação e dados demo
   ═══════════════════════════════════════════════════════════════ */

// ── Estado global (espelha o Firebase) ────────────────────────────
let STATE = {
  ordens:       [],
  estoque:      [],
  fornecedores: [],
  alertas:      [],
  metricas:     {}
};

// ── Dados iniciais de demonstração ────────────────────────────────
function seedDemoData() {
  STATE.ordens = [
    { id: "OP-2025-001", produto: "Flange Aço ABNT 1020 ø50mm",     qty: 500,  responsavel: "Carlos Mendes",   prio: "alta",  status: "producao",     prazo: "2025-06-10", criado: Date.now() - 86400000*2 },
    { id: "OP-2025-002", produto: "Eixo Vazado 420mm",               qty: 120,  responsavel: "Ana Souza",       prio: "media", status: "qualidade",    prazo: "2025-06-12", criado: Date.now() - 86400000 },
    { id: "OP-2025-003", produto: "Suporte Estampado Zincado",       qty: 800,  responsavel: "João Lima",       prio: "baixa", status: "aguardando",   prazo: "2025-06-18", criado: Date.now() - 86400000*3 },
    { id: "OP-2025-004", produto: "Chapa Perfurada 3mm",             qty: 200,  responsavel: "Maria Costa",     prio: "alta",  status: "concluido",    prazo: "2025-06-05", criado: Date.now() - 86400000*5 },
    { id: "OP-2025-005", produto: "Bucha Bronze SAE 660",            qty: 350,  responsavel: "Pedro Alves",     prio: "media", status: "planejamento", prazo: "2025-06-20", criado: Date.now() },
    { id: "OP-2025-006", produto: "Porca Sextavada M16 Inox",        qty: 2000, responsavel: "Fernanda Reis",   prio: "baixa", status: "aguardando",   prazo: "2025-06-25", criado: Date.now() - 3600000 },
    { id: "OP-2025-007", produto: "Chaveta Paralela DIN 6885",       qty: 600,  responsavel: "Ricardo Neto",    prio: "alta",  status: "producao",     prazo: "2025-06-08", criado: Date.now() - 7200000 },
    { id: "OP-2025-008", produto: "Tampa Fundida GG-25",             qty: 80,   responsavel: "Luciana Torres",  prio: "media", status: "qualidade",    prazo: "2025-06-14", criado: Date.now() - 86400000*4 },
    { id: "OP-2025-009", produto: "Mola Helicoidal D=25mm",          qty: 450,  responsavel: "Marcos Silva",    prio: "baixa", status: "cancelado",    prazo: "2025-06-01", criado: Date.now() - 86400000*7 },
    { id: "OP-2025-010", produto: "Pino Cilíndrico Temperado",       qty: 1200, responsavel: "Camila Faria",    prio: "alta",  status: "planejamento", prazo: "2025-06-22", criado: Date.now() - 1800000 },
    { id: "OP-2025-011", produto: "Engrenagem Helicoidal M2",        qty: 60,   responsavel: "Diego Martins",   prio: "media", status: "producao",     prazo: "2025-06-11", criado: Date.now() - 86400000*1.5 },
    { id: "OP-2025-012", produto: "Arruela de Pressão M12",          qty: 3000, responsavel: "Patrícia Duarte", prio: "baixa", status: "concluido",    prazo: "2025-06-03", criado: Date.now() - 86400000*6 },
  ];

  STATE.estoque = [
    { id: "EST-001",  nome: "Aço ABNT 1020 Barra",        cat: "Chapas e Perfis",         qty: 850, min: 200,  max: 2000, unidade: "kg" },
    { id: "EST-002",  nome: "Parafuso M8×25 Zincado",     cat: "Fixadores",               qty: 320, min: 500,  max: 5000, unidade: "un" },
    { id: "EST-003",  nome: "Óleo de Corte 15L",          cat: "Fluidos e Lubrificantes", qty: 45,  min: 20,   max: 200,  unidade: "L"  },
    { id: "EST-004",  nome: "Cabo Elétrico 16mm²",        cat: "Componentes Elétricos",   qty: 180, min: 50,   max: 500,  unidade: "m"  },
    { id: "EST-005",  nome: "Chapa Inox 304 3mm",         cat: "Chapas e Perfis",         qty: 12,  min: 30,   max: 200,  unidade: "un" },
    { id: "EST-006",  nome: "Bucha Bronze SAE 660",       cat: "Componentes Elétricos",   qty: 95,  min: 40,   max: 300,  unidade: "un" },
    { id: "EST-007",   nome: "Luva Nitrílica Tamanho M",  cat: "EPI e Segurança",         qty: 18,  min: 100,  max: 1000, unidade: "par"},
    { id: "EST-008",   nome: "Aço SAE 52100 Rolamento",   cat: "Chapas e Perfis",         qty: 430, min: 100,  max: 1000, unidade: "kg" },
    { id: "EST-009",  nome: "Graxa Moly-Bisulfeto 2kg",  cat: "Fluidos e Lubrificantes", qty: 67,  min: 20,   max: 150,  unidade: "un" },
  ];

  STATE.fornecedores = [
    { id: "FOR-001", nome: "Aços Villares S.A.",    cnpj: "60.864.903/0001-82", cat: "Aços e Metais",    lead: "7 dias",  status: "ativo"    },
    { id: "FOR-002", nome: "Parafusos Parmetal",    cnpj: "18.427.620/0001-55", cat: "Fixadores",        lead: "3 dias",  status: "ativo"    },
    { id: "FOR-003", nome: "Químicos Ipiranga",     cnpj: "33.337.122/0001-18", cat: "Lubrificantes",    lead: "5 dias",  status: "ativo"    },
    { id: "FOR-004", nome: "Inox do Brasil",        cnpj: "05.229.043/0001-77", cat: "Aço Inox",         lead: "10 dias", status: "suspenso" },
    { id: "FOR-005", nome: "Bronze & Ligas LTDA",   cnpj: "94.120.485/0001-34", cat: "Ligas Metálicas",  lead: "8 dias",  status: "ativo"    },
  ];

  STATE.alertas = [
    { id: "ALT-001", tipo: "red",   titulo: "Estoque Crítico: Chapa Inox 304",    desc: "Quantidade atual (12 un) abaixo do mínimo (30 un). Necessário reposição urgente.",                      time: "há 2 horas", ativo: true  },
    { id: "ALT-002", tipo: "red",   titulo: "Estoque Crítico: Luva Nitrílica",    desc: "Quantidade atual (18 par) abaixo do mínimo (100 par). Risco de parada operacional (NR-12).",            time: "há 3 horas", ativo: true  },
    { id: "ALT-003", tipo: "amber", titulo: "Prazo Crítico: OP-2025-007",         desc: "Ordem de Produção OP-2025-007 com prazo em 2 dias e status 'Em Produção'. Risco de atraso.",            time: "há 1 hora",  ativo: true  },
    { id: "ALT-004", tipo: "amber", titulo: "Fornecedor Suspenso: Inox do Brasil",desc: "Fornecedor suspenso possui 3 ordens de compra pendentes. Necessário indicar substituto.",               time: "há 5 horas", ativo: false },
    { id: "ALT-005", tipo: "green", titulo: "Produção Concluída: OP-2025-004",    desc: "Ordem OP-2025-004 finalizada com 200 peças aprovadas no controle de qualidade.",                        time: "há 6 horas", ativo: false },
  ];

  STATE.metricas = {
    ordensAtivas:      STATE.ordens.filter(o => !['concluido','cancelado'].includes(o.status)).length,
    pecasMes:          18450,
    itensCriticos:     STATE.estoque.filter(i => i.qty < i.min).length,
    alertasPendentes:  STATE.alertas.filter(a => a.ativo).length
  };
}
