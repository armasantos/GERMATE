create extension if not exists pgcrypto;
create type material_status as enum ('RASCUNHO', 'EM_ANALISE', 'APROVADO', 'ATIVO', 'OBSOLETO');
create table if not exists organizations (id uuid primary key default gen_random_uuid(), name text not null, created_at timestamptz not null default now());
create table if not exists disciplines (id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id), name text not null, unique (organization_id, name));
create table if not exists material_groups (id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id), name text not null, unique (organization_id, name));
create table if not exists materials (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id),
  group_id uuid not null references material_groups(id), discipline_id uuid not null references disciplines(id),
  code text not null, name text not null, class_name text not null,
  current_status material_status not null default 'RASCUNHO', current_revision integer not null default 1 check (current_revision > 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (organization_id, code)
);
create table if not exists material_revisions (
  id uuid primary key default gen_random_uuid(), material_id uuid not null references materials(id) on delete cascade,
  revision integer not null check (revision > 0), status material_status not null default 'RASCUNHO',
  properties jsonb not null default '{}'::jsonb, created_by uuid, created_at timestamptz not null default now(),
  approved_at timestamptz, unique (material_id, revision)
);
create table if not exists technical_documents (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id),
  material_id uuid references materials(id), name text not null, storage_path text not null,
  document_revision text not null, status material_status not null default 'RASCUNHO', created_by uuid, created_at timestamptz not null default now()
);
create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references organizations(id),
  actor_id uuid, entity_type text not null, entity_id uuid not null, action text not null,
  before_data jsonb, after_data jsonb, created_at timestamptz not null default now()
);
create index if not exists materials_search_idx on materials using gin (to_tsvector('simple', code || ' ' || name || ' ' || class_name));
create index if not exists audit_events_entity_idx on audit_events(entity_type, entity_id, created_at desc);
alter table organizations enable row level security;
alter table disciplines enable row level security;
alter table material_groups enable row level security;
alter table materials enable row level security;
alter table material_revisions enable row level security;
alter table technical_documents enable row level security;
alter table audit_events enable row level security;
