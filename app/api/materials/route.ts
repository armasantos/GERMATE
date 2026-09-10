import { listMaterials } from "@/lib/domain";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const supabase = await getSupabaseServerClient();
  if (!supabase) return Response.json({ data: listMaterials(query), meta: { source: "demo", query } });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Autenticação necessária." }, { status: 401 });
  const { data, error } = await supabase.from("materials")
    .select("id, code, name, class_name, current_status, current_revision, updated_at, material_groups(name), disciplines(name)")
    .or("code.ilike.%" + query + "%,name.ilike.%" + query + "%,class_name.ilike.%" + query + "%")
    .order("updated_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  const materials = (data ?? []).map((item) => {
    const row = item as { id: string; code: string; name: string; class_name: string; current_status: string; current_revision: number; updated_at: string; material_groups: { name: string } | null; disciplines: { name: string } | null };
    return { id: row.id, code: row.code, name: row.name, className: row.class_name, status: row.current_status, revision: row.current_revision, updatedAt: row.updated_at, group: row.material_groups?.name ?? "", discipline: row.disciplines?.name ?? "", properties: {} };
  });
  return Response.json({ data: materials, meta: { source: "supabase", query } });
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return Response.json({ error: "Supabase não configurado. O modo demo é somente leitura." }, { status: 503 });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Autenticação necessária." }, { status: 401 });
  const body = await request.json() as { code?: string; name?: string; className?: string; groupId?: string; disciplineId?: string; properties?: Record<string, string> };
  if (!body.code || !body.name || !body.className || !body.groupId || !body.disciplineId) return Response.json({ error: "code, name, className, groupId e disciplineId são obrigatórios." }, { status: 400 });
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", auth.user.id).single();
  if (!profile) return Response.json({ error: "Usuário sem organização vinculada." }, { status: 403 });
  const { data: material, error } = await supabase.from("materials").insert({
    organization_id: profile.organization_id, group_id: body.groupId, discipline_id: body.disciplineId, code: body.code, name: body.name, class_name: body.className
  }).select("id, code, name, current_status, current_revision").single();
  if (error || !material) return Response.json({ error: error?.message ?? "Não foi possível criar o material." }, { status: 400 });
  const revision = await supabase.from("material_revisions").insert({ material_id: material.id, revision: 1, status: "RASCUNHO", properties: body.properties ?? {}, created_by: auth.user.id });
  if (revision.error) return Response.json({ error: revision.error.message }, { status: 400 });
  const audit = await supabase.from("audit_events").insert({ organization_id: profile.organization_id, actor_id: auth.user.id, entity_type: "material", entity_id: material.id, action: "CREATED", after_data: material });
  if (audit.error) return Response.json({ error: audit.error.message }, { status: 400 });
  return Response.json({ data: material }, { status: 201 });
}
