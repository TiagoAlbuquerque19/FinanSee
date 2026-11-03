-- =============================================================
-- FinanSee: saldo inicial da conta
-- Para quem já rodou os arquivos anteriores: rode SÓ este arquivo
-- no "SQL Editor" do Supabase.
-- =============================================================

-- Quanto a pessoa já tinha na conta antes de começar a usar o FinanSee.
-- Ele entra no "Saldo disponível", que acumula mês a mês.
alter table public.configuracoes
  add column saldo_inicial numeric(12, 2) not null default 0;
