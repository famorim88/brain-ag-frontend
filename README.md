# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.# BRAIN AG - Frontend

Este repositório contém a interface de usuário (frontend) da aplicação BRAIN AG, desenvolvida para interagir com o backend de gerenciamento de produtores rurais. Ele oferece uma interface intuitiva para cadastrar, visualizar, editar e excluir informações de produtores, além de um dashboard interativo para análise de dados.

## Tecnologias Utilizadas

* **React**: Biblioteca JavaScript para construção de interfaces de usuário.
* **TypeScript**: Superconjunto tipado do JavaScript para maior robustez e manutenibilidade do código.
* **Styled Components**: Biblioteca para estilização de componentes React utilizando CSS-in-JS.
* **React Router DOM**: Para gerenciar o roteamento e navegação entre as diferentes páginas da aplicação.
* **Axios**: Cliente HTTP baseado em Promises para realizar requisições para a API do backend.
* **Chart.js / React Chart.js 2**: Para visualização de dados em gráficos interativos no dashboard.

## Estrutura do Projeto

frontend/
├── public/                 # Arquivos públicos (index.html, favicons, etc.)
├── src/
│   ├── api/                # Configuração da instância Axios e funções de comunicação com a API
│   │   └── api.ts
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── common/         # Componentes genéricos (botões, inputs, etc.)
│   │   └── producers/      # Componentes específicos de produtor (formulários, cards)
│   ├── contexts/           # Context API para gerenciamento de estado global
│   │   └── ProducerContext.tsx # Contexto para dados e operações de produtores
│   ├── pages/              # Componentes de página (rotas da aplicação)
│   │   ├── Dashboard.tsx   # Página principal com gráficos analíticos
│   │   ├── ProducerFormPage.tsx # Página para cadastro e edição de produtores
│   │   └── ProducersList.tsx # Página de listagem de produtores
│   ├── styles/             # Arquivos de estilo globais ou temas (se aplicável)
│   │   └── GlobalStyles.ts
│   ├── types.ts            # Definições de tipagem TypeScript para dados (interfaces)
│   ├── App.tsx             # Componente raiz da aplicação e configuração de rotas
│   ├── index.tsx           # Ponto de entrada da aplicação React
│   └── ...                 # Outros arquivos de configuração e boilerplate do Create React App
├── .env                    # Variáveis de ambiente (ex: URL da API do backend)
├── package.json            # Metadados do projeto e dependências NPM
├── tsconfig.json           # Configuração do TypeScript
└── README.md               # Este arquivo


## Funcionalidades Principais

* **Dashboard Interativo**: Exibe gráficos de pizza com dados agregados de fazendas por estado, culturas plantadas e uso do solo (área agricultável vs. vegetação), fornecendo uma visão rápida dos dados.
* **Lista de Produtores**: Tabela paginada e filtrável de todos os produtores cadastrados.
* **Cadastro de Produtor**: Formulário intuitivo para registrar novos produtores com todas as informações necessárias.
* **Edição de Produtor**: Capacidade de atualizar os dados de um produtor existente.
* **Gestão de Culturas (via formulário)**: Adicionar culturas a um produtor durante o cadastro ou edição.
* **Exclusão de Produtor**: Funcionalidade para remover produtores do sistema.
* **Validações Frontend**: Validações básicas de formulário para uma melhor experiência do usuário, complementando as validações do backend.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
