/* ==========================================================================
   IFRN ENCONTROU — Componentes de Interface, Navegação e Segurança DOM
   ========================================================================== */

window.IFRN_UI = (function () {
  const STATUS_LABELS = {
    PENDENTE: 'Pendente',
    DISPONIVEL: 'Disponível',
    EM_DEVOLUCAO: 'Em Devolução',
    DEVOLVIDO: 'Devolvido',
    REJEITADO: 'Rejeitado',
    ARQUIVADO: 'Arquivado',
    APROVADA: 'Aprovada',
    REJEITADA: 'Rejeitada',
    CONCLUIDA: 'Concluída',
    CANCELADA: 'Cancelada'
  };

  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length !== 3) return escapeHTML(dateStr);
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return '—';
    const dt = new Date(isoStr);
    if (Number.isNaN(dt.getTime())) return escapeHTML(isoStr);
    return dt.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getStatusBadge(status) {
    const safeStatus = escapeHTML(status);
    const label = STATUS_LABELS[status] || safeStatus;
    return `<span class="badge badge-${safeStatus}">${escapeHTML(label)}</span>`;
  }

  function renderNavbar(activePage) {
    const headerEl = document.getElementById('app-navbar');
    if (!headerEl) return;

    const state = window.IFRN_STORE.getState();
    const user = window.IFRN_STORE.getCurrentUser();

    const navItems = [
      { id: 'home', label: 'Início', href: 'index.html' },
      { id: 'objetos', label: 'Objetos Encontrados', href: 'objetos.html' },
      { id: 'cadastrar', label: 'Cadastrar Objeto', href: 'cadastrar-objeto.html' }
    ];

    if (user) {
      navItems.push({ id: 'painel-aluno', label: 'Meus Registros', href: 'painel-aluno.html' });
      if (user.isModeradorApac) {
        navItems.push({ id: 'painel-apac', label: 'Moderação APAC', href: 'painel-apac.html' });
      }
      if (user.perfil === 'ADMIN') {
        navItems.push({ id: 'painel-admin', label: 'Administração', href: 'painel-admin.html' });
      }
    }

    const userOptions = state.usuarios
      .map(
        (u) =>
          `<option value="${escapeHTML(u.id)}" ${user && user.id === u.id ? 'selected' : ''}>${escapeHTML(u.nome)} (${escapeHTML(
            u.isModeradorApac ? 'Moderador APAC' : u.perfil
          )})</option>`
      )
      .join('');

    headerEl.innerHTML = `
      <div class="institutional-bar">
        <div class="container">
          <span>Instituto Federal do Rio Grande do Norte — <strong>Campus Lajes</strong></span>
          <div class="demo-switcher">
            <label for="demo-role-select">Simular Perfil:</label>
            <select id="demo-role-select" title="Alternar perfil para demonstração">
              <option value="" ${!user ? 'selected' : ''}>Visitante (Deslogado)</option>
              ${userOptions}
            </select>
            <button type="button" id="btn-reset-demo" style="background:none;border:1px solid rgba(255,255,255,0.35);color:#fff;border-radius:4px;padding:1px 6px;font-size:0.72rem;cursor:pointer;" title="Restaurar dados iniciais">Resetar</button>
          </div>
        </div>
      </div>

      <nav class="navbar" aria-label="Navegação principal">
        <div class="container navbar-inner">
          <a href="index.html" class="brand">
            <div class="brand-mark" aria-hidden="true">IF</div>
            <div class="brand-text">
              <span class="brand-title">IFRN <span>Encontrou</span></span>
              <span class="brand-subtitle">Achados e Perdidos • Campus Lajes</span>
            </div>
          </a>

          <button type="button" class="nav-toggle" id="nav-toggle-btn" aria-label="Abrir menu">
            ☰ Menu
          </button>

          <ul class="nav-links" id="nav-links-list">
            ${navItems
              .map(
                (item) => `
              <li>
                <a href="${item.href}" class="nav-link ${activePage === item.id ? 'active' : ''}">${item.label}</a>
              </li>`
              )
              .join('')}
          </ul>

          <div class="nav-actions">
            ${
              user
                ? `<div class="user-pill">
                    <span class="user-avatar">${escapeHTML(user.nome.charAt(0).toUpperCase())}</span>
                    <span>${escapeHTML(user.nome.split(' ')[0])}</span>
                  </div>`
                : `<a href="login.html" class="btn btn-outline-green btn-sm">Entrar</a>
                   <a href="cadastro.html" class="btn btn-primary btn-sm">Criar Conta</a>`
            }
          </div>
        </div>
      </nav>
    `;

    // Eventos da Navbar
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const linksList = document.getElementById('nav-links-list');
    if (toggleBtn && linksList) {
      toggleBtn.addEventListener('click', () => linksList.classList.toggle('open'));
    }

    const roleSelect = document.getElementById('demo-role-select');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        window.IFRN_STORE.setCurrentUser(e.target.value);
        window.location.reload();
      });
    }

    const resetBtn = document.getElementById('btn-reset-demo');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => window.IFRN_STORE.resetDemo());
    }
  }

  function renderFooter() {
    const footerEl = document.getElementById('app-footer');
    if (!footerEl) return;

    footerEl.innerHTML = `
      <footer class="footer">
        <div class="container footer-inner">
          <div>
            <strong>IFRN Encontrou</strong> — Sistema Centralizado de Achados e Perdidos<br />
            <span>IFRN Campus Lajes • Apoio Acadêmico e Coordenação (APAC)</span>
          </div>
          <div>
            <span>Desenvolvido para organização e transparência na devolução de pertences no campus.</span>
          </div>
        </div>
      </footer>
    `;
  }

  function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 200ms ease';
      setTimeout(() => toast.remove(), 220);
    }, 3500);
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  return {
    escapeHTML,
    formatDate,
    formatDateTime,
    getStatusBadge,
    renderNavbar,
    renderFooter,
    showToast,
    openModal,
    closeModal
  };
})();