-- =============================================================
-- FinanSee: investimentos (cofrinhos)
-- Para quem já rodou o schema.sql: rode SÓ este arquivo no
-- "SQL Editor" do Supabase.
-- =============================================================

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
