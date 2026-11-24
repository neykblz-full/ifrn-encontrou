/* ==========================================================================
   IFRN ENCONTROU — Script da Página Inicial (index.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  window.IFRN_UI.renderNavbar('home');
  window.IFRN_UI.renderFooter();

  const state = window.IFRN_STORE.getState();

  // Atualiza estatísticas
  const disponiveis = state.objetos.filter((o) => o.status === 'DISPONIVEL');
  const devolvidos = state.objetos.filter((o) => o.status === 'DEVOLVIDO');

  document.getElementById('stat-disponiveis').textContent = disponiveis.length;
  document.getElementById('stat-devolvidos').textContent = devolvidos.length;
  document.getElementById('stat-locais').textContent = state.locaisCampus.length;

  // Renderiza até 4 objetos recentes disponíveis
  const grid = document.getElementById('recent-objetos-grid');
  const recentes = disponiveis.slice(0, 4);

  if (recentes.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3>Nenhum objeto disponível no momento</h3>
        <p>Todos os itens aprovados já foram devolvidos ou estão aguardando triagem da APAC.</p>
      </div>
    `;
  } else {
    grid.innerHTML = recentes
      .map(
        (obj) => `
      <article class="objeto-card">
        <div class="objeto-thumb">
          <img src="${window.IFRN_UI.escapeHTML(obj.imagemUrl)}" alt="${window.IFRN_UI.escapeHTML(obj.titulo)}" />
          <div class="objeto-thumb-badge">${window.IFRN_UI.getStatusBadge(obj.status)}</div>
        </div>
        <div class="objeto-content">
          <div class="objeto-category">${window.IFRN_UI.escapeHTML(window.IFRN_STORE.getCategoriaNome(obj.categoriaId))}</div>
          <h3 class="objeto-title">${window.IFRN_UI.escapeHTML(obj.titulo)}</h3>
          <ul class="objeto-meta">
            <li>📍 ${window.IFRN_UI.escapeHTML(obj.localEncontrado)}</li>
            <li>📅 Encontrado em ${window.IFRN_UI.formatDate(obj.dataEncontrado)}</li>
          </ul>
          <div class="objeto-footer">
            <a href="detalhes.html?id=${obj.id}" class="btn btn-outline-green btn-sm btn-block">Ver Detalhes</a>
          </div>
        </div>
      </article>
    `
      )
      .join('');
  }

  // Busca rápida no Hero redireciona para objetos.html
  const searchForm = document.getElementById('hero-search-form');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('hero-search-input').value.trim();
    const url = q ? `objetos.html?q=${encodeURIComponent(q)}` : 'objetos.html';
    window.location.href = url;
  });
});