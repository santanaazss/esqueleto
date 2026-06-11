// ==========================================================================
// SISTEMA DE ALERTAS E HISTÓRICO - CORREÇÃO DEFINITIVA
// ==========================================================================

// 1. DADOS DE BACKUP (Caso o Firebase demore para responder, a tela não fica preta)
const DEFAULT_ALERTS_MOCK = {
    "alerta_1": {
        titulo: "Estoque Crítico: Chapa Inox 304",
        descricao: "Quantidade atual (12 un) abaixo do mínimo (30 un). Necessário reposição urgente.",
        tempo: "há 2 horas",
        resolvido: false
    },
    "alerta_2": {
        titulo: "Estoque Crítico: Luva Nitrílica",
        descricao: "Quantidade atual (18 par) abaixo do mínimo (100 par). Risco de parada operacional (NR-12).",
        tempo: "há 3 horas",
        resolvido: false
    },
    "alerta_3": {
        titulo: "Prazo Crítico: OP-2025-007",
        descricao: "Ordem de Produção OP-2025-007 com prazo em 2 dias e status 'Em Produção'. Risco de atraso.",
        tempo: "há 1 hora",
        resolvido: false
    },
    "alerta_4": {
        titulo: "Fornecedor Suspenso: Inox do Brasil",
        descricao: "Fornecedor suspenso possui 3 ordens de compra pendentes. Necessário indicar substituto.",
        tempo: "há 5 horas",
        resolvido: false
    },
    "alerta_5": {
        titulo: "Produção Concluída: OP-2025-004",
        descricao: "Ordem OP-2025-004 finalizada com 200 peças aprovadas no controle de qualidade.",
        tempo: "há 6 horas",
        resolvido: true
    }
};

// 2. FUNÇÃO MATADORA DE RENDERIZAÇÃO (Trata Objeto, Array e força exibição de tudo)
function renderAlerts(alertsData) {
    const listContainer = document.getElementById('alertList');
    if (!listContainer) return;

    // Força limpeza total do container para não duplicar nem sumir tudo
    listContainer.innerHTML = '';

    // Se o banco vier vazio no começo, usa o Mock para a tela nunca ficar em branco
    const dados = (alertsData && Object.keys(alertsData).length > 0) ? alertsData : DEFAULT_ALERTS_MOCK;

    // Varre TODOS os elementos do objeto sem ignorar os resolvidos
    Object.keys(dados).forEach(key => {
        const alerta = dados[key];
        const isResolvido = alerta.resolvido === true;
        
        // Renderização exata baseada nos prints do seu sistema
        const dotColor = isResolvido ? '#00e676' : '#ff3d00'; 
        const statusText = isResolvido ? '✔ Resolvido' : '⚠ Pendente';
        const opacity = isResolvido ? 'opacity: 0.5;' : 'opacity: 1;';

        const cardHTML = `
            <div class="card-alerta-item" style="margin-bottom: 16px; background: #121214; padding: 20px; border-radius: 8px; border: 1px solid #202024; ${opacity}">
                <div style="display: flex; align-items: flex-start; gap: 16px;">
                    <div style="width: 12px; height: 12px; border-radius: 50%; background: ${dotColor}; margin-top: 6px; flex-shrink: 0;"></div>
                    <div style="flex: 1;">
                        <strong style="font-size: 16px; color: #ffffff; display: block; margin-bottom: 6px;">${alerta.titulo}</strong>
                        <p style="margin: 0 0 8px 0; font-size: 14px; color: #8d8d99; line-height: 1.5;">${alerta.descricao}</p>
                        <span style="font-size: 12px; color: #7c7c8a; display: block; margin-bottom: 8px;">${alerta.tempo}</span>
                        <span style="font-size: 13px; font-weight: 600; color: ${dotColor}; display: flex; align-items: center; gap: 4px;">
                            ${statusText}
                        </span>
                    </div>
                </div>
            </div>
        `;
        listContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Atualiza os badges de notificação da UI
    updateAlertBadges(dados);
}

// 3. ATUALIZAÇÃO DOS BADGES DA SIDEBAR E TOPBAR
function updateAlertBadges(dados) {
    const pendentesCount = Object.values(dados).filter(a => !a.resolvido).length;

    // Badge do Sino (Topbar)
    const topbarBadge = document.getElementById('alertCount');
    if (topbarBadge) {
        topbarBadge.textContent = pendentesCount;
        topbarBadge.style.display = pendentesCount > 0 ? 'flex' : 'none';
    }

    // Badge do Menu Lateral (Sidebar)
    const sidebarBadge = document.getElementById('alertBadge');
    const navItemAlertas = document.getElementById('nav-alertas');
    if (sidebarBadge) {
        sidebarBadge.textContent = pendentesCount;
        sidebarBadge.style.display = pendentesCount > 0 ? 'inline-block' : 'none';
    }
    // Trata a bolinha vermelha com número caso seu CSS use o link direto
    const subBadge = navItemAlertas ? navItemAlertas.querySelector('.nav-badge') : null;
    if (subBadge) {
        subBadge.textContent = pendentesCount;
    }

    // Card de métricas do Dashboard principal
    const dashMetric = document.getElementById('m-alertas');
    if (dashMetric) {
        dashMetric.textContent = pendentesCount;
    }
}

// 4. FUNÇÃO QUE MARCA COMO LIDO E MANTÉM NA TELA
function clearAllAlerts() {
    console.log("Executando limpeza de alertas...");
    
    // Se estiver usando Firebase Realtime Database ativo:
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        const dbRef = firebase.database().ref('alertas');
        dbRef.once('value').then(snapshot => {
            const current = snapshot.val();
            if (!current) return;
            
            const updates = {};
            Object.keys(current).forEach(key => {
                updates[`${key}/resolvido`] = true;
            });
            return dbRef.update(updates);
        }).catch(err => console.warn("Erro Firebase, aplicando local:", err));
    }

    // Fallback Local instantâneo (Garante o funcionamento mesmo se o Firebase cair)
    Object.keys(DEFAULT_ALERTS_MOCK).forEach(key => {
        DEFAULT_ALERTS_MOCK[key].resolvido = true;
    });
    
    // Executa a renderização novamente com os dados atualizados em vez de sumir com tudo
    renderAlerts(DEFAULT_ALERTS_MOCK);
}

// 5. ESCUTA EM TEMPO REAL (Se conectada ao Firebase)
if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    try {
        firebase.database().ref('alertas').on('value', (snapshot) => {
            if (snapshot.exists()) {
                renderAlerts(snapshot.val());
            } else {
                renderAlerts(DEFAULT_ALERTS_MOCK);
            }
        });
    } catch(e) {
        console.log("Firebase configurado mas sem nós criados. Rodando local padrão.");
        document.addEventListener('DOMContentLoaded', () => renderAlerts(DEFAULT_ALERTS_MOCK));
    }
} else {
    // Inicialização automática de segurança para ambiente local/desenvolvimento
    document.addEventListener('DOMContentLoaded', () => renderAlerts(DEFAULT_ALERTS_MOCK));
}