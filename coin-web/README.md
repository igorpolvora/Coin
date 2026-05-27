# Coin Web

Frontend React 18 com Vite para a API de gerenciamento de moedas.

## Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **React Router DOM 6** - Roteamento
- **Axios** - Cliente HTTP
- **TanStack Query 5** - Gerenciamento de estado do servidor
- **Recharts** - Gráficos
- **Tailwind CSS** - Estilos utilitários
- **Lucide React** - Ícones
- **date-fns** - Manipulação de datas

## Setup

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview de Produção

```bash
npm run preview
```

## Estrutura de Pastas

```
coin-web/
├── src/
│   ├── api/              # Cliente HTTP e endpoints
│   ├── components/
│   │   ├── layout/       # Componentes de layout (Header, Footer, etc)
│   │   ├── ui/           # Componentes reutilizáveis (Button, Input, etc)
│   │   └── charts/       # Componentes de gráficos
│   ├── context/          # Contexto global do React
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas da aplicação
│   ├── utils/            # Funções utilitárias
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── public/               # Arquivos estáticos
├── index.html            # HTML raiz
├── vite.config.js        # Configuração do Vite (proxy /api)
├── tailwind.config.js    # Configuração do Tailwind
├── postcss.config.js     # Configuração do PostCSS
└── package.json
```

## Configuração do Vite

O arquivo `vite.config.js` inclui proxy para `/api` apontando para `http://localhost:8080`, permitindo chamadas sem CORS durante o desenvolvimento.

## Configuração do Tailwind CSS

Tailwind CSS está configurado com tema customizado incluindo cores primárias. Para modificar, edite `tailwind.config.js`.

## Desenvolvimento

### Componentes

Crie componentes React em `src/components/` e importe onde necessário.

### Pages

Crie páginas em `src/pages/` e configure rotas em `App.jsx`.

### Hooks Customizados

Use `src/hooks/` para custom hooks. Exemplo: `useFetch` para queries com React Query.

### Utilitários

Use `src/utils/` para funções helper como formatação de datas e valores.

## Conectando com a API

A aplicação está configurada para consumir a API em `http://localhost:8080/api`. 

Exemplo:

```javascript
import api from '../api/client'

// GET
const response = await api.get('/coins')

// POST
const response = await api.post('/coins', { name: 'Bitcoin' })
```

## Próximos Passos

1. Implementar páginas principais
2. Criar serviços de API em `src/api/`
3. Adicionar mais componentes UI em `src/components/ui/`
4. Implementar autenticação
5. Adicionar validações de formulários
