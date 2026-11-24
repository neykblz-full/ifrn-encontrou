# IFRN Encontrou — Sistema de Achados e Perdidos (Campus Lajes)

Plataforma web centralizada para registro, busca, moderação e devolução de objetos perdidos e encontrados no **IFRN — Campus Lajes**.

## Objetivo
Substituir a divulgação fragmentada em grupos de mensagens por um sistema único, organizado e auditável, com triagem realizada pelos servidores autorizados do setor da **APAC**.

## Arquitetura Planejada
- **Frontend:** HTML5, CSS3 e JavaScript puro (Vanilla JS)
- **Backend:** Node.js com Express *(em desenvolvimento)*
- **Banco de Dados:** PostgreSQL *(em desenvolvimento)*
- **Autenticação & Segurança:** Sessões seguras, hash de senhas com `bcrypt` e controle de acesso baseado em perfis (RBAC: Aluno, Moderador APAC e Administrador)

## Estrutura Atual do Projeto
```text
ifrn-encontrou/
├── public/                 # Camada de Interface (Frontend)
│   ├── assets/
│   │   ├── css/            # Identidade visual institucional e responsividade
│   │   └── js/             # Lógica de interface, filtros e simulação de dados
│   ├── index.html          # Página inicial e busca rápida
│   ├── objetos.html        # Catálogo com filtros por nome, categoria, local e data
│   ├── detalhes.html       # Detalhes do item e solicitação privada de devolução
│   ├── login.html          # Autenticação de usuários
│   ├── cadastro.html       # Criação de conta de aluno
│   └── cadastrar-objeto.html # Registro de objeto encontrado com upload de foto
├── .gitignore
└── README.md