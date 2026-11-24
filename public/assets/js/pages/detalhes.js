/* ==========================================================================
   IFRN ENCONTROU — Script de Detalhes e Solicitação (detalhes.html)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  window.IFRN_UI.renderNavbar('objetos');
  window.IFRN_UI.renderFooter();

  const params = new URLSearchParams(window.location.search);
  const objetoId = Number(params.get('id'));
  const container = document.getElementById('detalhes-container');

  function renderPage() {
    const state = window.IFRN_STORE.getState();
    const user = window.IFRN_STORE.getCurrentUser();
    const objeto = state.objetos.find((o) => o.id === objetoId);

    if (!objeto) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">⚠️</div>
          <h3>Objeto não encontrado</h3>
          <p>O registro solicitado não existe ou foi removido pela moderação.</p>
          <a href="objetos.html" class="btn btn-primary">Voltar para o catálogo</a>
        </div>
      `;
      return;
    }

    document.getElementById('breadcrumb-title').textContent = objeto.titulo;

    // Verifica se o usuário atual já solicitou este objeto
    const minhaSolicitacao = user
      ? state.solicitacoes.find(
          (s) => s.objetoId === objeto.id && s.solicitanteId === user.id && !['REJEITADA', 'CANCELADA'].includes(s.status)
        )
      : null;

    let actionHTML = '';

    if (objeto.status === 'DEVOLVIDO') {
      actionHTML = `
        <div class="alert alert-success">
          <strong>Objeto já devolvido:</strong> Este item foi entregue ao legítimo proprietário após validação da APAC.
        </div>
      `;
    } else if (objeto.status === 'EM_DEVOLUCAO') {
      actionHTML = `
        <div class="alert alert-info">
          <strong>Devolução em andamento:</strong> Já existe uma solicitação aprovada pela APAC para este pertence.
        </div>
      `;
    } else if (objeto.status === 'PENDENTE') {
      actionHTML = `
        <div class="alert alert-warning">
          <strong>Aguardando moderação:</strong> Este registro ainda está em análise pelos servidores da APAC.
        </div>
      `;
    } else if (!user) {
      actionHTML = `
        <div class="alert alert-info">
          Reconheceu este objeto? Entre com sua conta do campus para enviar uma solicitação de devolução.
        </div>
        <a href="login.html" class="btn btn-primary btn-lg btn-block">Entrar para Solicitar Devolução</a>
      `;
    } else if (minhaSolicitacao) {
      actionHTML = `
        <div class="alert alert-success">
          <strong>Solicitação registrada (#${minhaSolicitacao.id}):</strong> Status atual:
          ${window.IFRN_UI.getStatusBadge(minhaSolicitacao.status)}
        </div>
        <a href="painel-aluno.html" class="btn btn-outline-green btn-block">Acompanhar em Meus Registros</a>
      `;
    } else if (user.perfil === 'ADMIN' && !user.isModeradorApac) {
      actionHTML = `
        <div class="alert alert-info">
          Perfis estritamente administrativos não realizam reivindicações de objetos.
        </div>
      `;
    } else {
      actionHTML = `
        <button type="button" id="btn-abrir-solicitacao" class="btn btn-primary btn-lg btn-block">
          Este objeto é meu — Solicitar Devolução
        </button>
      `;
    }

    container.innerHTML = `
      <div class="detalhes-layout">
        <div class="detalhes-media">
          <img src="${window.IFRN_UI.escapeHTML(objeto.imagemUrl)}" alt="${window.IFRN_UI.escapeHTML(objeto.titulo)}" />
        </div>

        <div class="detalhes-info">
          <div class="detalhes-header">
            <div>
              <span class="objeto-category">${window.IFRN_UI.escapeHTML(
                window.IFRN_STORE.getCategoriaNome(objeto.categoriaId)
              )}</span>
              <h1 class="detalhes-title">${window.IFRN_UI.escapeHTML(objeto.titulo)}</h1>
            </div>
            ${window.IFRN_UI.getStatusBadge(objeto.status)}
          </div>

          <div class="detalhes-specs">
            <div class="spec-item">
              <span>Local Encontrado</span>
              <strong>${window.IFRN_UI.escapeHTML(objeto.localEncontrado)}</strong>
            </div>
            <div class="spec-item">
              <span>Data do Registro</span>
              <strong>${window.IFRN_UI.formatDate(objeto.dataEncontrado)}</strong>
            </div>
            <div class="spec-item">
              <span>Código do Item</span>
              <strong>#${objeto.id}</strong>
            </div>
            <div class="spec-item">
              <span>Setor Responsável</span>
              <strong>APAC • Campus Lajes</strong>
            </div>
          </div>

          <div class="detalhes-desc">
            <h3>Descrição e Características</h3>
            <p>${window.IFRN_UI.escapeHTML(objeto.descricao)}</p>
          </div>

          ${actionHTML}
        </div>
      </div>
    `;

    const btnAbrir = document.getElementById('btn-abrir-solicitacao');
    if (btnAbrir) {
      btnAbrir.addEventListener('click', () => window.IFRN_UI.openModal('modal-solicitacao'));
    }
  }

  // Eventos do Modal
  document.getElementById('btn-close-modal').addEventListener('click', () => {
    window.IFRN_UI.closeModal('modal-solicitacao');
  });
  document.getElementById('btn-cancel-modal').addEventListener('click', () => {
    window.IFRN_UI.closeModal('modal-solicitacao');
  });

  document.getElementById('form-solicitacao').addEventListener('submit', (e) => {
    e.preventDefault();
    const state = window.IFRN_STORE.getState();
    const user = window.IFRN_STORE.getCurrentUser();
    const justificativa = document.getElementById('justificativa-input').value.trim();

    if (!user) {
      window.IFRN_UI.showToast('Faça login antes de solicitar.', 'error');
      return;
    }

    if (justificativa.length < 15) {
      window.IFRN_UI.showToast('Descreva com mais detalhes (mínimo 15 caracteres).', 'warning');
      return;
    }

    const nextId = state.solicitacoes.length ? Math.max(...state.solicitacoes.map((s) => s.id)) + 1 : 501;

    state.solicitacoes.unshift({
      id: nextId,
      objetoId: objetoId,
      solicitanteId: user.id,
      justificativa,
      status: 'PENDENTE',
      moderadorId: null,
      observacaoModerador: '',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    });

    window.IFRN_STORE.addHistorico(state, {
      usuarioId: user.id,
      objetoId: objetoId,
      tipoAcao: 'NOVA_SOLICITACAO',
      statusAnterior: 'DISPONIVEL',
      statusNovo: 'DISPONIVEL',
      observacao: `Solicitação #${nextId} enviada para análise da APAC.`
    });

    window.IFRN_STORE.saveState(state);
    document.getElementById('justificativa-input').value = '';
    window.IFRN_UI.closeModal('modal-solicitacao');
    window.IFRN_UI.showToast('Solicitação enviada! Acompanhe a análise da APAC em Meus Registros.');
    renderPage();
  });

  renderPage();
});