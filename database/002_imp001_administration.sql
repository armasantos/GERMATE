create type app_role as enum (
  'ADMINISTRADOR',
  'ENGENHEIRO_MATERIAIS',
  'ENGENHEIRO_DISCIPLINA',
  'USUARIO_FUNCIONAL',
  'QUALIDADE',
  'SUPRIMENTOS',
  'FORNECEDOR',
  'AUDITOR'
);

alter table profiles add column if not exists role app_role not null default 'USUARIO_FUNCIONAL';
alter table profiles add column if not exists is_active boolean not null default true;
alter table profiles add column if not exists last_login_at timestamptz;

create table if not exists role_permissions (
  role app_role not null,
  permission_code text not null,
  description text not null,
  primary key (role, permission_code)
);

create table if not exists system_parameters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  parameter_key text not null,
  parameter_value jsonb not null default '{}'::jsonb,
  description text not null,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  unique (organization_id, parameter_key)
);

create or replace function is_organization_admin(target_organization uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and organization_id = target_organization and role = 'ADMINISTRADOR' and is_active = true);
$$;

insert into role_permissions (role, permission_code, description) values
  ('ADMINISTRADOR', 'admin.users.read', 'Consultar usuários da organização'),
  ('ADMINISTRADOR', 'admin.users.manage', 'Administrar usuários e perfis'),
  ('ADMINISTRADOR', 'admin.parameters.manage', 'Administrar parâmetros do sistema'),
  ('ADMINISTRADOR', 'admin.audit.read', 'Consultar auditoria'),
  ('AUDITOR', 'admin.audit.read', 'Consultar auditoria'),
  ('ENGENHEIRO_MATERIAIS', 'materials.manage', 'Administrar materiais'),
  ('QUALIDADE', 'quality.manage', 'Administrar qualidade')
on conflict (role, permission_code) do nothing;

alter table role_permissions enable row level security;
alter table system_parameters enable row level security;
create policy "role_permissions_authenticated_read" on role_permissions for select using (auth.uid() is not null);
create policy "profiles_admin_read" on profiles for select using (is_organization_admin(organization_id));
create policy "profiles_admin_update" on profiles for update using (is_organization_admin(organization_id)) with check (is_organization_admin(organization_id));
create policy "parameters_admin_read" on system_parameters for select using (is_organization_admin(organization_id));
create policy "parameters_admin_insert" on system_parameters for insert with check (is_organization_admin(organization_id));
create policy "parameters_admin_update" on system_parameters for update using (is_organization_admin(organization_id)) with check (is_organization_admin(organization_id));
