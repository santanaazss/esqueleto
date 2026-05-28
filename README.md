# SIGML 4.0 — Sistema Integrado de Gestão Logística e Manufatura

## Estrutura do projeto

```
sigml/
├── index.html              ← Ponto de entrada da aplicação
│
├── css/
│   ├── variables.css       ← Variáveis CSS: temas escuro e claro
│   ├── layout.css          ← Grid, topbar, sidebar, navegação
│   ├── components.css      ← Cards, tabelas, badges, kanban, estoque, alertas
│   └── pages.css           ← Login, chat, modais, formulários
│
├── js/
│   ├── theme.js            ← Dark/light mode (toggle + persistência no localStorage)
│   ├── config.js           ← Firebase config, usuários demo, constantes (KANBAN_COLS, BOT_INTENTS)
│   ├── state.js            ← Estado global (STATE) e dados de demonstração (seedDemoData)
│   ├── firebase.js         ← Inicialização Firebase, syncFromFirebase, fbWrite
│   ├── auth.js             ← Login, logout, mountApp
│   ├── render.js           ← Todas as funções de renderização (dashboard, kanban, estoque, etc.)
│   ├── chat.js             ← Chatbot LogBot (envio, processamento de intents, UI de mensagens)
│   ├── alerts.js           ← Gestão de alertas, checkEstoqueAlerts, ajustarEstoque, badges
│   ├── modals.js           ← Abertura/fechamento de modais, createOrdem, createItem
│   ├── reports.js          ← Geração de relatórios (produção, estoque, fornecedores)
│   └── app.js              ← Navegação, drag & drop Kanban, simulação realtime, init
│
└── README.md               ← Este arquivo
```

## Como usar

1. **Abrir localmente**: abra `index.html` diretamente no navegador.  
   > ⚠️ Alguns navegadores bloqueiam `fetch` de arquivos locais. Use um servidor local (ex: `npx serve .`) para garantir que os scripts CSS/JS sejam carregados corretamente.

2. **Servidor rápido**:
   ```bash
   cd sigml
   npx serve .
   # ou
   python3 -m http.server 8080
   ```

3. **Login demo**: as credenciais já vêm preenchidas.  
   - Admin: `admin@sigml.com.br` / `123456`  
   - Operador: `operador@sigml.com.br` / `123456`

## Tema escuro / claro

O botão **☀️ Claro / 🌙 Escuro** fica na topbar.  
A preferência é salva no `localStorage` e respeitada entre sessões.  
Na primeira visita, o sistema detecta a preferência do sistema operacional.

## Firebase (opcional)

Para conectar ao Firebase real, edite `js/config.js` com suas credenciais:

```js
const FIREBASE_CONFIG = {
  apiKey:        "SUA_API_KEY",
  authDomain:    "seu-projeto.firebaseapp.com",
  databaseURL:   "https://seu-projeto-rtdb.firebaseio.com",
  projectId:     "seu-projeto",
  ...
};
```

Sem credenciais válidas, o sistema opera em **modo demo** com dados locais.

## Tecnologias

| Camada     | Tecnologia                          |
|------------|-------------------------------------|
| UI         | HTML5, CSS3 (variáveis nativas)     |
| Ícones     | Phosphor Icons                      |
| Fontes     | IBM Plex Sans / IBM Plex Mono       |
| Backend    | Firebase Realtime Database + Auth   |
| Estado     | JavaScript vanilla (sem frameworks) |
