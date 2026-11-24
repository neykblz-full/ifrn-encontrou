/* ==========================================================================
   IFRN ENCONTROU — Script da Vitrine e Filtros (objetos.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  window.IFRN_UI.renderNavbar('objetos');
  window.IFRN_UI.renderFooter();

  const state = window.IFRN_STORE.getState();

  const inputQ = document.getElementById('filter-q');
  const selectCat = document.getElementById('filter-categoria');
  const selectLocal = document.getElementById('filter-local');
  const inputData = document.getElementById('filter-data');
  const selectStatus = document.getElementById('filter-status');
  const btnClear = document.getElementById('btn-clear-filters');
  const grid = document.getElementById('objetos-grid');
  const countLabel = document.getElementById('results-count');

  // Preenche categorias ativas
  state.categorias
    .filter((c) => c.ativa)
    .forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = cat.nome;
      selectCat.appendChild(opt);
    });

  // Preenche locais do Campus Lajes
  state.locaisCampus.forEach((local) => {
    const opt = document.createElement('option');
    opt.value = local;
    opt.textContent = local;
    selectLocal.appendChild(opt);
  });

  // Lê parâmetro ?q= vindo da página inicial
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) {
    inputQ.value = params.get('q');
  }

  function renderObjetos() {
    const termo = inputQ.value.trim().toLowerCase();
    const catId = selectCat.value;
    const local = selectLocal.value;
    const dataMin = inputData.value;
    const statusFilter = selectStatus.value;

    // Regra de negócio: itens PENDENTE, REJEITADO ou ARQUIVADO nunca aparecem na vitrine pública
    const publicStatuses = ['DISPONIVEL', 'EM_DEVOLUCAO', 'DEVOLVIDO'];

    const filtrados = state.objetos.filter((obj) => {
      if (!publicStatuses.includes(obj.status)) return false;

      if (statusFilter === 'ATIVOS' && !['DISPONIVEL', 'EM_DEVOLUCAO'].includes(obj.status)) {
        return false;
      }
      if (statusFilter !== 'ATIVOS' && obj.status !== statusFilter) {
        return false;
      }

      if (catId && String(obj.categoriaId) !== catId) return false;
      if (local && obj.localEncontrado !== local) return false;
      if (dataMin && obj.dataEncontrado < dataMin) return false;

      if (termo) {
        const hay = `${obj.titulo} ${obj.descricao} ${obj.localEncontrado}`.toLowerCase();
        if (!hay.includes(termo)) return false;
      }

      return true;
    });

    countLabel.textContent =
      filtrados.length === 1
        ? '1 objeto encontrado com os filtros atuais'
        : `${filtrados.length} objetos encontrados com os filtros atuais`;

    if (filtrados.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📭</div>
          <h3>Nenhum objeto corresponde à sua busca</h3>
          <p>Tente remover alguns filtros ou verifique novamente mais tarde após a triagem da APAC.</p>
          <button type="button" class="btn btn-outline-green btn-sm" id="empty-reset-btn">Limpar todos os filtros</button>
        </div>
      `;
      document.getElementById('empty-reset-btn').addEventListener('click', resetFilters);
      return;
    }

    grid.innerHTML = filtrados
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
            <a href="detalhes.html?id=${obj.id}" class="btn btn-primary btn-sm btn-block">
              ${obj.status === 'DISPONIVEL' ? 'Ver Detalhes e Solicitar' : 'Visualizar Registro'}
            </a>
          </div>
        </div>
      </article>
    `
      )
      .join('');
  }

  function resetFilters() {
    inputQ.value = '';
    selectCat.value = '';
    selectLocal.value = '';
    inputData.value = '';
    selectStatus.value = 'ATIVOS';
    renderObjetos();
  }

  [inputQ, selectCat, selectLocal, inputData, selectStatus].forEach((el) => {
    el.addEventListener('input', renderObjetos);
    el.addEventListener('change', renderObjetos);
  });

  btnClear.addEventListener('click', resetFilters);

  renderObjetos();
});