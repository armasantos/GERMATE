# AI_CONTEXT — Contexto de Continuidade do GERMATE

Este arquivo é um handoff operacional para qualquer pessoa ou IA que retome o desenvolvimento.

## Missão

Construir o GERMATE como uma plataforma especializada em materiais de engenharia, transformando informação dispersa em dados estruturados, rastreáveis, versionados e aplicáveis à engenharia. O Documento Mestre v1.1 é a referência de produto e domínio.

## Situação atual

- O repositório foi inicializado a partir do Documento Mestre v1.1.
- O primeiro incremento do MVP está implementado com Next.js/TypeScript.
- A interface e GET /api/materials usam dados demo em memória para permitir execução local.
- O contrato inicial de persistência está em database/001_initial_schema.sql.
- A decisão de stack está registrada em docs/02_ARQUITETURA/DEC-001-stack-mvp.md.
- A integração real com Supabase, autenticação, RLS e cadastro persistente ainda está pendente.
- Não trate dados demo como dados de produção.

## Regras de continuidade

- Comece cada tarefa lendo o README e as seções relevantes do Documento Mestre.
- Separe claramente requisito, hipótese, decisão e implementação.
- Preserve nomenclatura, unidades, códigos, versionamento e rastreabilidade do domínio.
- Toda alteração de modelo de dados deve incluir migração, validação e impacto esperado.
- Toda permissão deve ser negada por padrão e coberta por testes.
- Toda ação crítica deve ser auditável: quem, quando, o quê, antes/depois e motivo quando aplicável.
- Não remova requisitos do Documento Mestre silenciosamente; registre conflitos e proponha uma decisão.
- Não crie dados técnicos fictícios para preencher lacunas sem marcá-los como exemplo.
- Mantenha documentação e código no mesmo commit quando a mudança depender de ambos.

## Sequência recomendada

1. Fazer a decomposição do Documento Mestre em requisitos funcionais e não funcionais rastreáveis.
2. Definir stack, ambientes, estratégia de autenticação/autorização e política de segredos.
3. Modelar o núcleo de dados: materiais, especificações, normas, fabricantes, documentos, propriedades, versões e relacionamentos.
4. Definir identificadores, estados, regras de aprovação, histórico e trilha de auditoria.
5. Criar um esqueleto executável com configuração local, lint, testes e CI.
6. Implementar uma fatia vertical de cadastro, consulta, versionamento e auditoria.
7. Validar com cenários de engenharia antes de expandir módulos.
8. Manter um backlog rastreado no repositório e atualizar este arquivo após decisões relevantes.

## Critérios mínimos de pronto

Uma entrega só deve ser considerada pronta quando:

- o comportamento está documentado;
- os critérios de aceite estão testados;
- os dados e permissões têm validação;
- erros e casos-limite foram tratados;
- a mudança é reproduzível em ambiente limpo;
- o README ou documentação afetada foi atualizada;
- riscos, hipóteses e próximos passos estão registrados.

## Registro de decisões

Use este formato para novas decisões:

- **Data:**
- **Decisão:**
- **Motivo:**
- **Alternativas consideradas:**
- **Impactos:**
- **Validação necessária:**

## Próxima ação sugerida

Implementar a integração Supabase do Material Master: autenticação, organização atual, leitura persistente, criação de material, revisão inicial e evento de auditoria, mantendo o modo demo disponível para desenvolvimento local.


