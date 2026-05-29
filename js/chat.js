/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Chatbot (LogBot)
   ═══════════════════════════════════════════════════════════════ */

function initChat() {
  const msgs = document.getElementById('chatMessages');
  if (msgs && msgs.children.length === 0) {
    addBotMessage('Olá! Sou o **LogBot**, assistente do SIGML 4.0. Posso fornecer informações em tempo real sobre estoque, ordens de produção, alertas e métricas do sistema. Como posso ajudar?');
  }
  document.getElementById('quickReplies').innerHTML = QUICK_REPLIES.map(r =>
    `<button class="qr-btn" onclick="sendQuickReply('${r}')">${r}</button>`
  ).join('');
}

function sendQuickReply(text) {
  document.getElementById('chatInput').value = text;
  sendChat();
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  addUserMessage(text);
  showTyping();

  setTimeout(() => {
    removeTyping();
    addBotMessage(processIntent(text.toLowerCase()));
  }, 800 + Math.random() * 600);
}

function processIntent(text) {
  if (/estoque|insumo|material|mínimo|crítico|reposição/i.test(text)) return BOT_INTENTS.estoque();
  if (/ordem|produção|op-|ativa|status/i.test(text))                  return BOT_INTENTS.ordens();
  if (/alerta|aviso|pendente|urgente/i.test(text))                     return BOT_INTENTS.alertas();
  if (/métrica|indicador|kpi|dashboard/i.test(text))                   return BOT_INTENTS.metricas();
  if (/fornecedor|supplier|empresa/i.test(text))                       return BOT_INTENTS.fornecedores();
  if (/ajuda|help|comando|opções/i.test(text))                         return BOT_INTENTS.ajuda();
  return 'Não entendi completamente. Posso ajudar com: **estoque**, **ordens**, **alertas**, **métricas** ou **fornecedores**. Tente uma dessas palavras-chave!';
}
function addBotMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="bot-avatar" style="width:28px;height:28px;border-radius:6px;background:var(--accent-dim);border:1px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">
      <i class="ph ph-robot"></i>
    </div>
    <div>
      <div class="msg-bubble">${text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')}</div>
      <div class="msg-time">${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `
    <div>
      <div class="msg-bubble">${text}</div>
      <div class="msg-time">${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div  = document.createElement('div');
  div.className = 'msg bot';
  div.id        = 'typingIndicator';
  div.innerHTML = `
    <div style="width:28px;height:28px;border-radius:6px;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:16px">
      <i class="ph ph-robot"></i>
    </div>
    <div class="msg-bubble typing-dots"><span></span><span></span><span></span></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}
