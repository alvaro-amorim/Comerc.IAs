-- Retencao padrao: 90 dias
-- Execute manualmente quando necessario:
DELETE FROM public.events
WHERE created_at < now() - interval '90 days';

-- Opcional: automatizar limpeza diaria com pg_cron (se habilitado no projeto)
-- 1) Ative extensao:
--    CREATE EXTENSION IF NOT EXISTS pg_cron;
--
-- 2) Agende limpeza as 03:15 UTC todos os dias:
--    SELECT cron.schedule(
--      'events-retention-90d',
--      '15 3 * * *',
--      $$DELETE FROM public.events WHERE created_at < now() - interval '90 days';$$
--    );
--
-- 3) Para remover agendamento:
--    SELECT cron.unschedule('events-retention-90d');
