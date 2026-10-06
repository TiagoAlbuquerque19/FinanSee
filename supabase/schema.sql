-- =============================================================
-- FinanSee: estrutura do banco de dados (Supabase / PostgreSQL)
-- Rode este arquivo inteiro uma vez no "SQL Editor" do Supabase.
-- =============================================================

-- ---------- Tabelas ----------
-- user_id liga cada linha ao usuário que a criou.
-- "default auth.uid()" preenche sozinho com o usuário logado.
-- "on delete cascade" apaga os dados se o usuário for excluído.

create table public.transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  descricao text not null,
  valor numeric(12, 2) not null check (valor > 0),
  tipo text not null check (tipo in ('receita', 'despesa')),
  categoria text not null,
  data date not null,
  criado_em timestamptz not null default now()
);

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  criado_em timestamptz not null default now(),
  unique (user_id, nome)
);

create table public.metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  valor_alvo numeric(12, 2) not null check (valor_alvo > 0),
  valor_guardado numeric(12, 2) not null default 0 check (valor_guardado >= 0),
  prazo date,
  criado_em timestamptz not null default now()
);

create table public.lembretes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  titulo text not null,
  valor numeric(12, 2) check (valor > 0),
  vencimento date not null,
  recorrente boolean not null default false,
  pagamentos text[] not null default '{}',
  criado_em timestamptz not null default now()
);

-- Índices: deixam rápida a busca "todos os dados deste usuário"
create index on public.transacoes (user_id);
create index on public.categorias (user_id);
create index on public.metas (user_id);
create index on public.lembretes (user_id);

-- ---------- Segurança (Row Level Security) ----------
-- Com o RLS ligado, o banco só deixa cada usuário ler e mexer
-- nas linhas em que user_id é o id dele. Mesmo que alguém tente
-- pedir os dados dos outros, o banco recusa.

alter table public.transacoes enable row level security;
alter table public.categorias enable row level security;
alter table public.metas enable row level security;
alter table public.lembretes enable row level security;

create policy "Cada usuario acessa so as proprias transacoes"
  on public.transacoes for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Cada usuario acessa so as proprias categorias"
  on public.categorias for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Cada usuario acessa so as proprias metas"
  on public.metas for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Cada usuario acessa so os proprios lembretes"
  on public.lembretes for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Permissões para usuários logados usarem as tabelas pela API
grant select, insert, update, delete on public.transacoes to authenticated;
grant select, insert, update, delete on public.categorias to authenticated;
grant select, insert, update, delete on public.metas to authenticated;
grant select, insert, update, delete on public.lembretes to authenticated;

-- ---------- Investimentos (cofrinhos) ----------
-- (o mesmo conteúdo de supabase/migracoes/002_investimentos.sql)

-- Cada cofrinho: nome, banco e quanto rende (% do CDI)
create table public.investimentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null,
  banco text not null,
  percentual_cdi numeric(6, 2) not null default 100 check (percentual_cdi >= 0),
  criado_em timestamptz not null default now()
);

-- Tudo o que acontece num cofrinho:
--   aporte  = você guardou dinheiro
--   resgate = você tirou dinheiro
--   saldo   = você conferiu no banco e informou o valor real
-- "on delete cascade": excluir o cofrinho apaga o histórico dele
create table public.movimentos_investimento (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  investimento_id uuid not null references public.investimentos (id) on delete cascade,
  tipo text not null check (tipo in ('aporte', 'resgate', 'saldo')),
  valor numeric(12, 2) not null check (valor >= 0),
  data date not null,
  criado_em timestamptz not null default now()
);

-- Configurações do usuário (por enquanto, só o CDI). Uma linha por usuário
create table public.configuracoes (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  cdi_anual numeric(6, 2),
  cdi_atualizado_em date
);

create index on public.investimentos (user_id);
create index on public.movimentos_investimento (user_id);
create index on public.movimentos_investimento (investimento_id);

alter table public.investimentos enable row level security;
alter table public.movimentos_investimento enable row level security;
alter table public.configuracoes enable row level security;

create policy "Cada usuario acessa so os proprios investimentos"
  on public.investimentos for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Cada usuario acessa so os proprios movimentos"
  on public.movimentos_investimento for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Cada usuario acessa so as proprias configuracoes"
  on public.configuracoes for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.investimentos to authenticated;
grant select, insert, update, delete on public.movimentos_investimento to authenticated;
grant select, insert, update, delete on public.configuracoes to authenticated;
