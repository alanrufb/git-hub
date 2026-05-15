# FinançasPessoais

App de gestão financeira pessoal com dashboard, gráficos e autenticação — construído com Next.js 16, Supabase e shadcn/ui.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + **shadcn/ui** (base-ui)
- **Supabase** (PostgreSQL + Auth + RLS)
- **Recharts** para gráficos
- Deploy via **Vercel**

## Funcionalidades

- Autenticação com email/senha (Supabase Auth)
- Cadastro de receitas e despesas com categoria, data e descrição
- Dashboard com resumo mensal (receitas, despesas, saldo)
- Gráfico de pizza com despesas por categoria
- Listagem com filtros por período, tipo e categoria
- Editar e excluir transações
- Responsivo (mobile-first)

## Setup

### 1. Clonar e instalar

```bash
cd financas-pessoais
npm install
```

### 2. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No SQL Editor, execute o conteúdo de `supabase-schema.sql`
3. Vá em **Authentication → Providers** e habilite Email

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

As chaves ficam em **Settings → API** no painel do Supabase.

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Suba o repositório no GitHub
2. Importe o projeto na Vercel
3. Adicione as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy automático a cada push

## Estrutura

```
src/
├── app/
│   ├── (auth)/login        # Página de login
│   ├── (auth)/register     # Página de cadastro
│   ├── (app)/dashboard     # Dashboard principal
│   ├── (app)/transactions  # Lista de transações
│   └── actions/            # Server Actions
├── components/
│   ├── app-nav.tsx          # Navbar responsiva
│   ├── transaction-form.tsx # Formulário add/edit
│   ├── transaction-list.tsx # Lista com ações
│   ├── transaction-filters.tsx # Filtros
│   └── category-chart.tsx  # Gráfico Recharts
├── lib/supabase/           # Clientes Supabase
└── types/                  # Tipos TypeScript
```
