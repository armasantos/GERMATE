import { getSupabaseServerClient } from "@/lib/supabase/server";

const demo = {
  users: [
    { id: "demo-1", displayName: "Administrador GERMATE", email: "admin@germate.demo", role: "ADMINISTRADOR", isActive: true, lastLoginAt: "2026-09-10T13:00:00Z" },
    { id: "demo-2", displayName: "Engenharia de Materiais", email: "materiais@germate.demo", role: "ENGENHEIRO_MATERIAIS", isActive: true, lastLoginAt: "2026-09-09T16:20:00Z" }
  ],
  permissions: [
    { role: "ADMINISTRADOR", permissionCode: "admin.users.manage", description: "Administrar usuários e perfis" },
    { role: "ADMINISTRADOR", permissionCode: "admin.parameters.manage", description: "Administrar parâmetros do sistema" },
    { role: "ADMINISTRADOR", permissionCode: "admin.audit.read", description: "Consultar auditoria" }
  ],
  parameters: [
    { parameterKey: "material.code.prefix", parameterValue: "MAT-", description: "Prefixo padrão para novos materiais" },
    { parameterKey: "audit.retention.days", parameterValue: 2555, description: "Retenção mínima da auditoria em dias" }
  ],
  audit: [
    { action: "LOGIN", entityType: "user", actor: "Administrador GERMATE", createdAt: "2026-09-10T13:00:00Z" },
    { action: "CREATED", entityType: "material", actor: "Administrador GERMATE", createdAt: "2026-09-10T12:45:00Z" }
  ],
  meta: { source: "demo" }
};

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return Response.json(demo);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Autenticação necessária." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("organization_id, role, is_active").eq("id", auth.user.id).single();
  if (!profile || !profile.is_active || profile.role !== "ADMINISTRADOR") return Response.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  const [users, permissions, parameters, audit] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role, is_active, last_login_at").eq("organization_id", profile.organization_id).order("display_name"),
    supabase.from("role_permissions").select("role, permission_code, description").order("role"),
    supabase.from("system_parameters").select("parameter_key, parameter_value, description, updated_at").eq("organization_id", profile.organization_id).order("parameter_key"),
    supabase.from("audit_events").select("action, entity_type, actor_id, created_at").eq("organization_id", profile.organization_id).order("created_at", { ascending: false }).limit(30)
  ]);
  const error = users.error ?? permissions.error ?? parameters.error ?? audit.error;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({
    users: (users.data ?? []).map((item) => ({ id: item.id, displayName: item.display_name, role: item.role, isActive: item.is_active, lastLoginAt: item.last_login_at })),
    permissions: (permissions.data ?? []).map((item) => ({ role: item.role, permissionCode: item.permission_code, description: item.description })),
    parameters: (parameters.data ?? []).map((item) => ({ parameterKey: item.parameter_key, parameterValue: item.parameter_value, description: item.description, updatedAt: item.updated_at })),
    audit: (audit.data ?? []).map((item) => ({ action: item.action, entityType: item.entity_type, actor: item.actor_id, createdAt: item.created_at })),
    meta: { source: "supabase" }
  });
}

export async function PATCH(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return Response.json({ error: "Supabase não configurado. O modo demo é somente leitura." }, { status: 503 });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Autenticação necessária." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("organization_id, role, is_active").eq("id", auth.user.id).single();
  if (!profile || profile.role !== "ADMINISTRADOR" || !profile.is_active) return Response.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  const body = await request.json() as { parameterKey?: string; parameterValue?: unknown; description?: string };
  if (!body.parameterKey || body.parameterValue === undefined || !body.description) return Response.json({ error: "parameterKey, parameterValue e description são obrigatórios." }, { status: 400 });
  const { data, error } = await supabase.from("system_parameters").upsert({
    organization_id: profile.organization_id, parameter_key: body.parameterKey, parameter_value: body.parameterValue, description: body.description, updated_by: auth.user.id, updated_at: new Date().toISOString()
  }, { onConflict: "organization_id,parameter_key" }).select("id, parameter_key, parameter_value, description, updated_at").single();
  if (error || !data) return Response.json({ error: error?.message ?? "Parâmetro inválido." }, { status: 400 });
  await supabase.from("audit_events").insert({
    organization_id: profile.organization_id, actor_id: auth.user.id, entity_type: "system_parameter", entity_id: data.id, action: "UPDATED", after_data: data
  });
  return Response.json({ data });
}
