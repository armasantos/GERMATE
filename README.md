# GERMATE — Gerenciador de Materiais de Engenharia

[![CI](https://github.com/armasantos/GERMATE/actions/workflows/ci.yml/badge.svg)](https://github.com/armasantos/GERMATE/actions/workflows/ci.yml)

O GERMATE é uma plataforma para estruturar, rastrear e aplicar conhecimento e dados de materiais de engenharia em projetos, compras, fabricação, inspeção, qualidade e operação.

## Fonte de verdade

A especificação funcional, conceitual e técnica está em [GERMATE_DOCUMENTO_MESTRE_v1.1.md](GERMATE_DOCUMENTO_MESTRE_v1.1.md). Antes de implementar uma funcionalidade, leia as seções relacionadas desse documento e registre qualquer decisão nova no repositório.

## Estado inicial

O primeiro incremento do MVP já está iniciado. A interface demo e a API de pesquisa usam dados em memória; o contrato persistente está em database/001_initial_schema.sql.

## Executar localmente

    pnpm install
    pnpm dev

Abra http://localhost:3000. A API inicial está disponível em GET /api/materials?q=termo.

Sem as variáveis do Supabase, a aplicação funciona em modo demo somente leitura. Para ativar autenticação e persistência, siga docs/02_ARQUITETURA/SUPABASE_SETUP.md.

Para validação:

    pnpm typecheck
    pnpm build

## Como uma IA deve continuar o desenvolvimento

1. Leia este README, [AI_CONTEXT.md](AI_CONTEXT.md) e o Documento Mestre.
2. Identifique o objetivo do trabalho e as seções do Documento Mestre afetadas.
3. Antes de codificar, proponha ou registre a decisão técnica, o escopo e os critérios de aceite.
4. Implemente a menor fatia vertical útil, mantendo rastreabilidade, versionamento e permissões.
5. Adicione testes e documentação para cada comportamento novo.
6. Não invente requisitos de domínio: quando houver lacuna, marque a hipótese explicitamente e peça validação.
7. Ao concluir, atualize o contexto, informe arquivos alterados, testes executados, riscos e próximos passos.

## Princípios

- Dados técnicos devem ser estruturados, rastreáveis, versionados e reutilizáveis.
- Segurança, auditoria, qualidade e governança são requisitos do produto.
- Decisões que alteram o domínio devem ser documentadas.
- Mudanças pequenas e reversíveis são preferíveis a grandes reescritas.
- O idioma padrão de negócio é português do Brasil; preserve termos técnicos e unidades com precisão.

## Licença

Defina a licença antes de distribuir o projeto publicamente.
