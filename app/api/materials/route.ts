import { listMaterials } from "@/lib/domain";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return Response.json({ data: listMaterials(query), meta: { source: "demo", query } });
}
