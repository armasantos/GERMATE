# MVP — Requisitos rastreáveis

Escopo inicial derivado da seção 42 do Documento Mestre v1.1.

| ID | Requisito | Critério de aceite | Status |
| --- | --- | --- | --- |
| MVP-AUTH-001 | O usuário deve iniciar sessão com autenticação segura. | Usuário autenticado acessa apenas sua organização. | Implementado; requer configuração Supabase |
| MVP-MAT-001 | O sistema deve cadastrar um Material Master com código único por organização. | Código duplicado é rejeitado e o material recebe revisão inicial. | Implementado na API |
| MVP-MAT-002 | O sistema deve permitir pesquisar materiais. | Pesquisa encontra por código, nome, grupo, classe ou disciplina. | Implementado |
| MVP-MAT-003 | O material deve possuir revisão e status controlados. | Toda revisão tem número, status, autor e data. | Implementado na criação |
| MVP-DOC-001 | O material deve poder ser relacionado a documento técnico. | Documento guarda vínculo, revisão, status e caminho de armazenamento. | Modelado no banco |
| MVP-AUD-001 | Alterações críticas devem gerar auditoria. | Evento registra ator, entidade, ação, antes, depois e data. | Implementado na criação |
| MVP-ORG-001 | Dados devem ser isolados por organização. | Consultas e políticas não expõem dados de outra organização. | RLS implementado; requer validação |

## Fora do primeiro incremento

Fornecedores, certificados, inspeções, equivalências, MTO, IA Copilot e integrações serão desenvolvidos após a estabilização do núcleo.
