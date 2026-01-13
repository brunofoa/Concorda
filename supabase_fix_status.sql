-- EXECUTE TODAS AS LINHAS ABAIXO NO EDITOR SQL DO SUPABASE

-- 1. Adicionar colunas de assinatura se não existirem
ALTER TABLE agreements 
ADD COLUMN IF NOT EXISTS initial_signature_creator TEXT,
ADD COLUMN IF NOT EXISTS initial_signature_partner TEXT,
ADD COLUMN IF NOT EXISTS signed_at TIMESTAMPTZ;

-- 2. Tentar atualizar o Tipo ENUM (se 'agreement_status' for um TYPE no Postgres)
-- Se este comando falhar, é porque você não está usando um TYPE ENUM, pode ignorar o erro desta linha específica.
DO $$
BEGIN
    ALTER TYPE agreement_status ADD VALUE 'waiting_signatures';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Não foi possível alterar o TYPE (talvez não exista ou já tenha o valor). Continuando...';
END $$;

-- 3. Atualizar a Check Constraint (caso esteja usando constraint instead of enum or in addition)
ALTER TABLE agreements DROP CONSTRAINT IF EXISTS agreements_status_check;
ALTER TABLE agreements ADD CONSTRAINT agreements_status_check 
CHECK (status IN ('active', 'archived', 'draft', 'completed', 'failed', 'waiting_signatures'));
