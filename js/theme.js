/* ═══════════════════════════════════════════════════════════════
   SIGML 4.0 — Tema (dark / light)
   ═══════════════════════════════════════════════════════════════ */

const THEME_KEY = 'sigml_theme';

/**
 * Aplica o tema no <html> e atualiza o ícone do botão.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const btn  = document.getElementById('themeToggle');
  if (!btn) return;

  if (theme === 'light') {
    btn.innerHTML = '<span class="theme-icon">🌙</span> Escuro';
    btn.title = 'Mudar para modo escuro';
  } else {
    btn.innerHTML = '<span class="theme-icon">☀️</span> Claro';
    btn.title = 'Mudar para modo claro';
  }
}

/**
 * Alterna entre dark e light.
 * Chamado pelo botão na topbar.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/**
 * Inicializa o tema: prioridade = localStorage → preferência do SO → dark.
 */
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }
}

// Inicializa assim que o script é carregado
initTheme();
