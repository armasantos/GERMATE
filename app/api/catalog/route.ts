import { getSupabaseServerClient } from "@/lib/supabase/server";

const demo = {
  groups: [{ id: "demo-met", name: "Metálicos" }, { id: "demo-nao-met", name: "Não metálicos" }],
  disciplines: [{ id: "demo-mec", name: "Mecânica" }, { id: "demo-tub", name: "Tubulação" }, { id: "demo-int", name: "Integridade" }]
};

export async function GET() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return Response.json({ ...demo, meta: { source: "demo" } });
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return Response.json({ error: "Autenticação necessária." }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", auth.user.id).single();
  if (!profile) return Response.json({ error: "Usuário sem organização vinculada." }, { status: 403 });
  const [groups, disciplines] = await Promise.all([
    supabase.from("material_groups").select("id, name").eq("organization_id", profile.organization_id).order("name"),
    supabase.from("disciplines").select("id, name").eq("organization_id", profile.organization_id).order("name")
  ]);
  if (groups.error || disciplines.error) return Response.json({ error: groups.error?.message ?? disciplines.error?.message }, { status: 500 });
  return Response.json({ groups: groups.data ?? [], disciplines: disciplines.data ?? [], meta: { source: "supabase" } });
}
