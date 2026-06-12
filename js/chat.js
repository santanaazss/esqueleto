/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Chatbot (LogBot) with Suggestions
   ═══════════════════════════════════════════════════════════════ */

// Predefined suggestion categories with multiple options
const SUGGESTION_CATEGORIES = {
    estoque: [
        " Ver itens com estoque crítico",
        " Qual o nível atual do estoque?",
        " Quais materiais precisam de reposição?",
        " Mostrar curva ABC do estoque"
    ],
    ordens: [
        " Ordens de produção ativas",
        " Ordens com prazo próximo",
        " Ordens concluídas este mês",
        " Ordens de alta prioridade"
    ],
    alertas: [
        " Ver todos os alertas ativos",
        " Alertas de estoque crítico",
        " Resumo de incidentes",
        " Últimos 5 alertas"
    ],
    metricas: [
        " Mostrar métricas do dashboard",
        "Eficiência da produção",
        " KPIs do dia",
        " Performance semanal"
    ],
    fornecedores: [
        " Listar fornecedores ativos",
        " Fornecedores suspensos",
        " Lead time dos fornecedores",
        " Melhores fornecedores por OTIF"
    ],
    ajuda: [
        " Como usar o chatbot?",
        " Comandos disponíveis",
        " Dicas rápidas",
        "Tutorial do sistema"
    ]
};




let currentSuggestionCategory = null;
let suggestionCarouselIndex = 0;

function initChat() {
    const msgs = document.getElementById('chatMessages');
    if (msgs && msgs.children.length === 0) {
        addBotMessage('Olá! Sou o **LogBot**, assistente do SIGML 4.0. Posso fornecer informações em tempo real sobre estoque, ordens de produção, alertas e métricas do sistema. Como posso ajudar?');
    }
    
    // Initialize suggestion carousel
    renderSuggestionCarousel();
    renderQuickReplies();
}

function renderSuggestionCarousel() {
    const carousel = document.getElementById('suggestionCarousel');
    if (!carousel) return;
    
    // Get all suggestions as flat array with categories
    const allSuggestions = [];
    for (const [category, suggestions] of Object.entries(SUGGESTION_CATEGORIES)) {
        suggestions.forEach(suggestion => {
            allSuggestions.push({ text: suggestion, category });
        });
    }
    
    // Show first 6 suggestions
    const visibleSuggestions = allSuggestions.slice(0, 6);
    
    carousel.innerHTML = visibleSuggestions.map(s => `
        <button class="suggestion-chip" onclick="sendSuggestion('${s.text.replace(/'/g, "\\'")}')">
            ${s.text}
        </button>
    `).join('');
    
    // Add navigation if more suggestions exist
    if (allSuggestions.length > 6) {
        carousel.insertAdjacentHTML('beforeend', `
            <button class="suggestion-chip nav-chip" onclick="rotateSuggestions()">
                <i class="ph ph-arrow-right"></i> Mais
            </button>
        `);
    }
}

function rotateSuggestions() {
    const allSuggestions = [];
    for (const [category, suggestions] of Object.entries(SUGGESTION_CATEGORIES)) {
        suggestions.forEach(suggestion => {
            allSuggestions.push({ text: suggestion, category });
        });
    }
    
    suggestionCarouselIndex = (suggestionCarouselIndex + 6) % allSuggestions.length;
    const visibleSuggestions = [];
    for (let i = 0; i < 6; i++) {
        const idx = (suggestionCarouselIndex + i) % allSuggestions.length;
        visibleSuggestions.push(allSuggestions[idx]);
    }
    
    const carousel = document.getElementById('suggestionCarousel');
    if (carousel) {
        carousel.innerHTML = visibleSuggestions.map(s => `
            <button class="suggestion-chip" onclick="sendSuggestion('${s.text.replace(/'/g, "\\'")}')">
                ${s.text}
            </button>
        `).join('');
        
        carousel.insertAdjacentHTML('beforeend', `
            <button class="suggestion-chip nav-chip" onclick="rotateSuggestions()">
                <i class="ph ph-arrow-right"></i> Mais
            </button>
        `);
    }
}

function renderQuickReplies() {
    const quickReplies = document.getElementById('quickReplies');
    if (!quickReplies) return;
    
    quickReplies.innerHTML = QUICK_SUGGESTIONS.map(r => `
        <button class="qr-btn" onclick="sendQuickReply('${r}')">
            ${r}
        </button>
    `).join('');
}

function sendSuggestion(text) {
    document.getElementById('chatInput').value = text;
    sendChat();
}

function sendQuickReply(text) {
    document.getElementById('chatInput').value = text;
    sendChat();
}

function sendChat() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    addUserMessage(text);
    showTyping();

    setTimeout(() => {
        removeTyping();
        addBotMessage(processIntent(text.toLowerCase()));
        // Refresh suggestions after bot response
        renderSuggestionCarousel();
        renderQuickReplies();
    }, 800 + Math.random() * 600);
}

function processIntent(text) {
    if (/estoque|insumo|material|mínimo|crítico|reposição|nível|curva abc|ruptura/i.test(text)) 
        return BOT_INTENTS.estoque();
    if (/ordem|produção|op-|ativa|status|prazo|concluída|pendente|prioridade/i.test(text)) 
        return BOT_INTENTS.ordens();
    if (/alerta|aviso|pendente|urgente|incidente|ocorrência|resolveu|resolvido/i.test(text)) 
        return BOT_INTENTS.alertas();
    if (/métrica|indicador|kpi|dashboard|eficiência|performance|semanal|diário|kpis/i.test(text)) 
        return BOT_INTENTS.metricas();
    if (/fornecedor|supplier|empresa|lead time|otif|contrato|homologado/i.test(text)) 
        return BOT_INTENTS.fornecedores();
    if (/ajuda|help|comando|opções|tutorial|dicas|como usar/i.test(text)) 
        return BOT_INTENTS.ajuda();
    return 'Não entendi completamente. Posso ajudar com: **estoque**, **ordens**, **alertas**, **métricas** ou **fornecedores**. Tente uma dessas palavras-chave! Ou clique nos botões acima para sugestões rápidas.';
}

function addBotMessage(text) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.innerHTML = `
        <div class="bot-avatar" style="width:32px;height:32px;border-radius:8px;background:var(--accent-dim);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">
            <i class="ph ph-robot"></i>
        </div>
        <div style="flex:1">
            <div class="msg-bubble">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
            <div class="msg-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg user';
    div.innerHTML = `
        <div style="flex:1; display: flex; justify-content: flex-end;">
            <div>
                <div class="msg-bubble">${escapeHtml(text)}</div>
                <div class="msg-time">${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showTyping() {
    const msgs = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.id = 'typingIndicator';
    div.innerHTML = `
        <div class="bot-avatar" style="width:32px;height:32px;border-radius:8px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:18px">
            <i class="ph ph-robot"></i>
        </div>
        <div class="msg-bubble typing-dots"><span></span><span></span><span></span></div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
}