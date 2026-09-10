# DEC-001 — Stack inicial do MVP

- **Status:** Aceita para o primeiro incremento
- **Data:** 2026-09-10

## Decisão

Usar Next.js com TypeScript para a interface web e API inicial, PostgreSQL/Supabase como persistência alvo e migrations SQL versionadas no repositório.

## Motivo

Essa escolha segue a direção consolidada no Documento Mestre, reduz o número de tecnologias no MVP e permite evoluir da demonstração local para autenticação, RLS, storage e API hospedados.

## Limites

O primeiro protótipo usa dados em memória para permitir execução local sem credenciais. A migration SQL define o contrato persistente; a integração real com Supabase é a próxima etapa obrigatória antes de produção.

## Consequências

- O código de domínio não deve depender diretamente da interface.
- As políticas RLS devem ser adicionadas antes do uso multiusuário.
- Dados demo nunca devem ser tratados como dados de produção.
