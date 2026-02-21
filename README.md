# Atualização — Orçamento + Funil (Comerc IAs)

## Arquivos inclusos
- `src/pages/OrcamentoPage.js` — catálogo de serviços (visual mais limpo + modal de detalhes)
- `src/pages/OrcamentoFunnel.js` — funil/quiz (3 ofertas + extras + WhatsApp)
- `src/styles/OrcamentoPage.css` — estilos (inclui o layout compacto novo)
- `src/data/precos.json` e `src/data/precos_en.json`

## Pontos corrigidos
- Planos mensais: agora usam `preco_mensal_efetivo` corretamente (antes ficava 0).
- WhatsApp: agora abre direto no número configurado (`5532991147944`).
- Link externo do Vercel removido.
- Visual do catálogo: cards compactos + detalhes no modal (menos poluição).

## Como aplicar
Substitua os arquivos correspondentes no seu projeto mantendo a mesma estrutura de pastas.
