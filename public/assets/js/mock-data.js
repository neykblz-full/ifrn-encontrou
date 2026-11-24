/* ==========================================================================
   IFRN ENCONTROU — Dados Simulados e Persistência Local (Sprint 1 - UI)
   Será substituído pelas chamadas à API Node/PostgreSQL na Sprint 3.
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'ifrn_encontrou_demo_v1';

  // Ilustrações SVG embutidas para garantir carregamento instantâneo e offline
  function createItemIllustration(label, bgColor, accentColor, iconSymbol) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="${bgColor}"/>
        <circle cx="300" cy="175" r="78" fill="${accentColor}" opacity="0.14"/>
        <circle cx="300" cy="175" r="54" fill="${accentColor}" opacity="0.22"/>
        <text x="300" y="193" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" fill="${accentColor}">${iconSymbol}</text>
        <text x="300" y="295" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" text-anchor="middle" fill="#1e293b">${label}</text>
        <text x="300" y="324" font-family="Inter, Arial, sans-serif" font-size="14" text-anchor="middle" fill="#64748b">Registro Fotográfico — IFRN Campus Lajes</text>
      </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg.trim());
  }

  const INITIAL_DATA = {
    activeUserId: 'usr_aluno_1',
    locaisCampus: [
      'Biblioteca do Campus Lajes',
      'Bloco de Salas de Aula — Térreo',
      'Bloco de Salas de Aula — 1º Andar',
      'Laboratório de Informática 01',
      'Laboratório de Informática 02',
      'Pátio Central / Cantina',
      'Ginásio Poliesportivo',
      'Auditório',
      'Recepção / Guarita',
      'Área de Convivência'
    ],
    categorias: [
      { id: 1, nome: 'Garrafas', descricao: 'Garrafas térmicas, squeezes e copos reutilizáveis', ativa: true },
      { id: 2, nome: 'Eletrônicos', descricao: 'Fones de ouvido, calculadoras, carregadores, pen drives e celulares', ativa: true },
      { id: 3, nome: 'Documentos', descricao: 'Carteirinhas estudantis, RG, CPF, cartões de transporte e banco', ativa: true },
      { id: 4, nome: 'Materiais Escolares', descricao: 'Cadernos, estojos, livros, apostilas e réguas', ativa: true },
      { id: 5, nome: 'Acessórios', descricao: 'Chaves, óculos, relógios, pulseiras, mochilas e sombrinhas', ativa: true },
      { id: 6, nome: 'Roupas', descricao: 'Casacos, moletons, fardamentos e bonés', ativa: true },
      { id: 7, nome: 'Outros', descricao: 'Demais itens pessoais encontrados no campus', ativa: true }
    ],
    usuarios: [
      {
        id: 'usr_aluno_1',
        nome: 'Lucas Gabriel Silva',
        email: 'lucas.silva@academico.ifrn.edu.br',
        perfil: 'ALUNO',
        isModeradorApac: false,
        ativo: true,
        criadoEm: '2026-10-02'
      },
      {
        id: 'usr_aluno_2',
        nome: 'Mariana Costa Oliveira',
        email: 'mariana.costa@academico.ifrn.edu.br',
        perfil: 'ALUNO',
        isModeradorApac: false,
        ativo: true,
        criadoEm: '2026-10-05'
      },
      {
        id: 'usr_apac_1',
        nome: 'Carla Mendes (Servidora APAC)',
        email: 'carla.mendes@ifrn.edu.br',
        perfil: 'SERVIDOR',
        isModeradorApac: true,
        ativo: true,
        criadoEm: '2026-09-15'
      },
      {
        id: 'usr_admin_1',
        nome: 'Prof. Marcos Tavares (Admin)',
        email: 'marcos.tavares@ifrn.edu.br',
        perfil: 'ADMIN',
        isModeradorApac: false,
        ativo: true,
        criadoEm: '2026-09-01'
      }
    ],
    objetos: [
      {
        id: 101,
        titulo: 'Garrafa Térmica Inox Azul 750ml',
        descricao: 'Garrafa térmica metálica azul fosco com tampa preta de rosca. Encontrada próxima às mesas de estudo.',
        imagemUrl: createItemIllustration('Garrafa Térmica Azul', '#eff6ff', '#1d4ed8', '🍶'),
        categoriaId: 1,
        localEncontrado: 'Biblioteca do Campus Lajes',
        dataEncontrado: '2026-11-21',
        status: 'DISPONIVEL',
        cadastradoPorId: 'usr_aluno_2',
        criadoEm: '2026-11-21T14:20:00'
      },
      {
        id: 102,
        titulo: 'Calculadora Científica Casio fx-82MS',
        descricao: 'Calculadora científica preta com capa protetora deslizante. Estava sobre a terceira banca da fileira central.',
        imagemUrl: createItemIllustration('Calculadora Científica', '#f0fdf4', '#15803d', '🧮'),
        categoriaId: 2,
        localEncontrado: 'Bloco de Salas de Aula — 1º Andar',
        dataEncontrado: '2026-11-20',
        status: 'DISPONIVEL',
        cadastradoPorId: 'usr_aluno_1',
        criadoEm: '2026-11-20T17:10:00'
      },
      {
        id: 103,
        titulo: 'Chaveiro com Chave de Moto e Tag Verde',
        descricao: 'Molho contendo uma chave de motocicleta, uma chave residencial pequena e identificador plástico verde.',
        imagemUrl: createItemIllustration('Chaveiro com Tag Verde', '#fefce8', '#a16207', '🔑'),
        categoriaId: 5,
        localEncontrado: 'Pátio Central / Cantina',
        dataEncontrado: '2026-11-22',
        status: 'EM_DEVOLUCAO',
        cadastradoPorId: 'usr_apac_1',
        criadoEm: '2026-11-22T10:05:00'
      },
      {
        id: 104,
        titulo: 'Estojo Escolar Preto com Canetas e Compasso',
        descricao: 'Estojo de tecido preto com zíper único contendo canetas esferográficas, lápis, borracha e compasso metálico.',
        imagemUrl: createItemIllustration('Estojo Escolar Preto', '#f8fafc', '#334155', '✏️'),
        categoriaId: 4,
        localEncontrado: 'Laboratório de Informática 01',
        dataEncontrado: '2026-11-22',
        status: 'DISPONIVEL',
        cadastradoPorId: 'usr_aluno_2',
        criadoEm: '2026-11-22T16:40:00'
      },
      {
        id: 105,
        titulo: 'Fone de Ouvido Bluetooth Branco (Case)',
        descricao: 'Estojo carregador branco com fones intra-auriculares sem fio encontrado na arquibancada.',
        imagemUrl: createItemIllustration('Fone Bluetooth Branco', '#fef2f2', '#b91c1c', '🎧'),
        categoriaId: 2,
        localEncontrado: 'Ginásio Poliesportivo',
        dataEncontrado: '2026-11-23',
        status: 'PENDENTE',
        cadastradoPorId: 'usr_aluno_1',
        criadoEm: '2026-11-23T09:15:00'
      },
      {
        id: 106,
        titulo: 'Casaco Moletom Cinza Mescla Tamanho M',
        descricao: 'Moletom fechado cinza claro sem estampa frontal, deixado no encosto de uma cadeira.',
        imagemUrl: createItemIllustration('Casaco Moletom Cinza', '#f1f5f9', '#475569', '🧥'),
        categoriaId: 6,
        localEncontrado: 'Auditório',
        dataEncontrado: '2026-11-23',
        status: 'PENDENTE',
        cadastradoPorId: 'usr_aluno_2',
        criadoEm: '2026-11-23T11:30:00'
      },
      {
        id: 107,
        titulo: 'Cartão de Transporte Intermunicipal',
        descricao: 'Cartão eletrônico de passagem encontrado próximo ao portão de acesso principal.',
        imagemUrl: createItemIllustration('Cartão de Transporte', '#ecfdf5', '#047857', '💳'),
        categoriaId: 3,
        localEncontrado: 'Recepção / Guarita',
        dataEncontrado: '2026-11-18',
        status: 'DEVOLVIDO',
        cadastradoPorId: 'usr_apac_1',
        criadoEm: '2026-11-18T08:00:00'
      }
    ],
    solicitacoes: [
      {
        id: 501,
        objetoId: 103,
        solicitanteId: 'usr_aluno_1',
        justificativa: 'A chave é de uma Honda Biz vermelha, tem um arranhão na parte plástica preta e na tag verde está escrito meu apelido "Lu" apagado de caneta.',
        status: 'APROVADA',
        moderadorId: 'usr_apac_1',
        observacaoModerador: 'Detalhes conferem exatamente com o item guardado na sala da APAC. Comparecer com documento com foto.',
        criadoEm: '2026-11-22T12:15:00',
        atualizadoEm: '2026-11-22T14:00:00'
      },
      {
        id: 502,
        objetoId: 101,
        solicitanteId: 'usr_aluno_1',
        justificativa: 'Essa garrafa térmica azul é minha, esqueci ontem à tarde na mesa perto dos computadores da biblioteca. Tem um pequeno amassado na base.',
        status: 'PENDENTE',
        moderadorId: null,
        observacaoModerador: '',
        criadoEm: '2026-11-23T10:20:00',
        atualizadoEm: '2026-11-23T10:20:00'
      }
    ],
    historico: [
      {
        id: 901,
        usuarioId: 'usr_apac_1',
        objetoId: 101,
        tipoAcao: 'APROVACAO_ANUNCIO',
        statusAnterior: 'PENDENTE',
        statusNovo: 'DISPONIVEL',
        observacao: 'Objeto conferido e publicado na vitrine do campus.',
        criadoEm: '2026-11-21T15:00:00'
      },
      {
        id: 902,
        usuarioId: 'usr_apac_1',
        objetoId: 103,
        tipoAcao: 'APROVACAO_SOLICITACAO',
        statusAnterior: 'DISPONIVEL',
        statusNovo: 'EM_DEVOLUCAO',
        observacao: 'Solicitação #501 aprovada após validação das características.',
        criadoEm: '2026-11-22T14:00:00'
      },
      {
        id: 903,
        usuarioId: 'usr_apac_1',
        objetoId: 107,
        tipoAcao: 'CONFIRMACAO_DEVOLUCAO',
        statusAnterior: 'EM_DEVOLUCAO',
        statusNovo: 'DEVOLVIDO',
        observacao: 'Entrega presencial concluída na APAC mediante conferência de documento.',
        criadoEm: '2026-11-19T16:10:00'
      }
    ]
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
        return JSON.parse(JSON.stringify(INITIAL_DATA));
      }
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  window.IFRN_STORE = {
    getState: loadState,
    saveState: saveState,
    resetDemo: function () {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
      window.location.reload();
    },
    getCurrentUser: function () {
      const state = loadState();
      if (!state.activeUserId) return null;
      return state.usuarios.find((u) => u.id === state.activeUserId) || null;
    },
    setCurrentUser: function (userId) {
      const state = loadState();
      state.activeUserId = userId || null;
      saveState(state);
    },
    getCategoriaNome: function (categoriaId) {
      const state = loadState();
      const cat = state.categorias.find((c) => c.id === Number(categoriaId));
      return cat ? cat.nome : 'Outros';
    },
    getUsuarioNome: function (userId) {
      const state = loadState();
      const usr = state.usuarios.find((u) => u.id === userId);
      return usr ? usr.nome : 'Usuário do Campus';
    },
    addHistorico: function (state, { usuarioId, objetoId, tipoAcao, statusAnterior, statusNovo, observacao }) {
      const nextId = state.historico.length ? Math.max(...state.historico.map((h) => h.id)) + 1 : 1;
      state.historico.unshift({
        id: nextId,
        usuarioId,
        objetoId,
        tipoAcao,
        statusAnterior,
        statusNovo,
        observacao: observacao || '',
        criadoEm: new Date().toISOString()
      });
    }
  };
})();