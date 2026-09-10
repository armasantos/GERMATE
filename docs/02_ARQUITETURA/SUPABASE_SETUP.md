# Configuração do Supabase

## 1. Aplicar o schema

Execute database/001_initial_schema.sql no SQL Editor do projeto Supabase.

## 2. Criar a primeira organização

Depois de aplicar o schema, crie a organização e os catálogos iniciais:

    insert into organizations (name) values ('GERMATE Engenharia') returning id;

Use o UUID retornado nos comandos seguintes:

    insert into material_groups (organization_id, name) values
      ('ORGANIZATION_ID', 'Metálicos'),
      ('ORGANIZATION_ID', 'Não metálicos');

    insert into disciplines (organization_id, name) values
      ('ORGANIZATION_ID', 'Mecânica'),
      ('ORGANIZATION_ID', 'Tubulação'),
      ('ORGANIZATION_ID', 'Integridade');

## 3. Criar o primeiro usuário

Crie o usuário em Authentication > Users no painel do Supabase. Depois, vincule o usuário à organização:

    insert into profiles (id, organization_id, display_name)
    values ('AUTH_USER_ID', 'ORGANIZATION_ID', 'Administrador GERMATE');

A aplicação exige esse vínculo para consultar catálogos e criar materiais.

## 4. Configurar a aplicação

Copie .env.example para .env.local e preencha:

    NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon

Inicie com pnpm dev e acesse /login.

## Segurança

Nunca coloque a service role key no navegador ou em arquivo de ambiente público. O primeiro MVP usa a anon key com autenticação do usuário e RLS.
