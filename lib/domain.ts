export type MaterialStatus = "RASCUNHO" | "EM_ANALISE" | "APROVADO" | "ATIVO" | "OBSOLETO";

export type Material = {
  id: string; code: string; name: string; group: string; discipline: string;
  className: string; status: MaterialStatus; revision: number; updatedAt: string;
  properties: Record<string, string>;
};

const materials: Material[] = [
  { id: "mat-001", code: "MAT-AST-A516-60", name: "Chapa de aço carbono para vaso de pressão", group: "Metálicos", discipline: "Mecânica", className: "Aço carbono", status: "ATIVO", revision: 2, updatedAt: "2026-09-10", properties: { Norma: "ASTM A516", Grau: "60", Espessura: "12 mm" } },
  { id: "mat-002", code: "MAT-SS-A312-TP316L", name: "Tubo sem costura em aço inoxidável", group: "Metálicos", discipline: "Tubulação", className: "Aço inoxidável austenítico", status: "APROVADO", revision: 1, updatedAt: "2026-09-08", properties: { Norma: "ASTM A312", Grau: "TP316L", Diâmetro: "6 in" } },
  { id: "mat-003", code: "MAT-EL-EPX-001", name: "Revestimento epóxi para proteção anticorrosiva", group: "Não metálicos", discipline: "Integridade", className: "Revestimento orgânico", status: "EM_ANALISE", revision: 1, updatedAt: "2026-09-05", properties: { Norma: "ISO 12944", Sistema: "C5-M", Cura: "7 dias" } }
];

export function listMaterials(query = "") {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  if (!normalized) return materials;
  return materials.filter((material) =>
    [material.code, material.name, material.group, material.discipline, material.className]
      .some((value) => value.toLocaleLowerCase("pt-BR").includes(normalized))
  );
}
