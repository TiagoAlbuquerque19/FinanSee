# FinanSee

Controle de finanças pessoais: gastos e receitas por mês, categorias, metas de economia, lembretes de contas e gráficos. Cada pessoa tem a própria conta.

## Funcionalidades

- **Dashboard**: saldo, receitas e despesas do mês, comparação com o mês anterior, gastos por categoria (gráfico de rosca), últimos 6 meses (gráfico de barras), metas e próximos vencimentos
- **Transações**: lançamento de receitas e despesas com data e categoria, filtros por texto, tipo e categoria
- **Categorias**: categorias prontas e personalizadas, com o total de cada uma no mês
- **Metas**: quanto falta e quanto guardar por mês para chegar no prazo
- **Lembretes**: contas a pagar (únicas ou mensais), avisos de atraso e vencimento, com registro da despesa ao marcar como paga
- **Relatórios**: 3, 6 ou 12 meses, com barras, evolução do saldo, categorias e tabela mês a mês
- **Login e cadastro**: os dados ficam na nuvem, e cada usuário vê só os próprios
- **Tema claro e escuro**, e layout adaptado para celular

## Tecnologias

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org), com [Vite](https://vite.dev)
- [React Router](https://reactrouter.com) para as páginas
- [Recharts](https://recharts.org) para os gráficos
- [Lucide](https://lucide.dev) para os ícones
- [Supabase](https://supabase.com) para login e banco de dados (PostgreSQL)

## Como rodar no seu computador

1. Instale as dependências:

   ```bash
   npm install
   ```

2. No [Supabase](https://supabase.com), crie um projeto e rode o arquivo `supabase/schema.sql` no **SQL Editor**. Ele cria as tabelas e as regras de segurança.

3. Copie o `.env.example` para `.env.local` e preencha com a URL e a chave pública do seu projeto no Supabase:

   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica
   ```

4. Rode:

   ```bash
   npm run dev
   ```

   E abra http://localhost:5173.

## Comandos

| Comando           | O que faz                                   |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Roda o site em modo de desenvolvimento      |
| `npm run build`   | Confere os tipos e gera a versão final      |
| `npm run lint`    | Procura problemas no código                 |
| `npm run preview` | Abre a versão final gerada pelo `build`     |

## Estrutura das pastas

```
src/
├── components/   peças da tela (formulários, listas, gráficos...)
├── pages/        uma pasta por página (Dashboard, Transações, Metas...)
├── context/      dados compartilhados (login e finanças)
├── hooks/        atalhos para usar os contextos (useAuth, useFinancas, useTema)
├── services/     conversa com o banco de dados (banco.ts)
├── lib/          configuração do Supabase
├── utils/        funções de cálculo e formatação (datas, moeda, resumos)
├── data/         listas fixas (categorias e cores dos gráficos)
└── types/        formatos dos dados (Transacao, Meta, Lembrete)
supabase/
└── schema.sql    estrutura do banco e regras de segurança (RLS)
```

## Segurança

Todas as tabelas usam **Row Level Security** do PostgreSQL: o próprio banco só deixa cada usuário ler e alterar as linhas que são dele. A chave usada no site é a chave **pública** do Supabase. A chave secreta (`service_role`) nunca deve ir para o código.
