-- =============================================================
-- FinanSee: imposto de renda nos cofrinhos
-- Para quem já rodou os arquivos anteriores: rode SÓ este arquivo
-- no "SQL Editor" do Supabase.
-- =============================================================

-- Como o imposto de renda é descontado do rendimento:
--   nenhuma = não descontar (isentos como LCI/LCA/poupança, ou ver o bruto)
--   fundo   = fundos de renda fixa: 22,5% até 180 dias, 20% depois
--   cdb     = CDB, caixinhas, Tesouro: 22,5% / 20% / 17,5% / 15%
alter table public.investimentos
  add column tributacao text not null default 'nenhuma'
  check (tributacao in ('nenhuma', 'fundo', 'cdb'));
