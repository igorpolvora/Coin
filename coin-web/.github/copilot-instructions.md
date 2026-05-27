# Coin Web - Copilot Instructions

Frontend React 18 com Vite para gerenciamento de moedas.

## Configuração do Projeto

- **Framework**: React 18
- **Build Tool**: Vite
- **Node Version**: 16+ recomendado
- **Package Manager**: npm

## Dependências Principais

- **react-router-dom@6** - Roteamento SPA
- **axios** - Cliente HTTP
- **@tanstack/react-query@5** - Gerenciamento de estado servidor
- **recharts** - Gráficos
- **lucide-react** - Ícones
- **tailwindcss** - Estilos utilitários
- **date-fns** - Manipulação de datas

## Configuração Importante

### Vite Proxy
- URL: `/api` → `http://localhost:8080`
- Sem CORS durante desenvolvimento

### Tailwind CSS
- Configurado com tema customizado
- Cores primárias (sky blue)
- Arquivo: `tailwind.config.js`

## Estrutura de Pastas

```
src/
├── api/              # Cliente Axios e endpoints
├── components/
│   ├── layout/       # Header, Footer, Sidebar
│   ├── ui/           # Button, Input, Card, etc
│   └── charts/       # SimpleChart, etc
├── context/          # Contexto React global
├── hooks/            # useFetch, useAuth, etc
├── pages/            # Home, Dashboard, etc
├── utils/            # helpers, formatters
├── App.jsx
├── main.jsx
└── index.css
```

## Como Executar

**Desenvolvimento:**
```bash
npm run dev
```
Aplicação: `http://localhost:5173`

**Build:**
```bash
npm run build
```

**Preview:**
```bash
npm run preview
```

## Dicas de Desenvolvimento

1. Use componentes em `src/components/ui/` para reutilização
2. Custom hooks em `src/hooks/` para lógica compartilhada
3. React Query para cache de dados da API
4. Tailwind CSS para estilização
5. Lucide React para ícones consistentes
6. `src/utils/helpers.js` para funções de formatação

## API Client

```javascript
import api from '../api/client'

// Com autenticação automática do localStorage
const response = await api.get('/coins')
```

## Próximos Passos

1. Implementar páginas principais
2. Criar serviços de API em `src/api/`
3. Adicionar mais componentes
4. Implementar autenticação JWT
5. Testes unitários
