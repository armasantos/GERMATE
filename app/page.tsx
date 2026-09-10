"use client";

import { useMemo, useState } from "react";
import { listMaterials, type Material } from "@/lib/domain";

export default function Home() {
  const [query, setQuery] = useState("");
  const materials = useMemo(() => listMaterials(query), [query]);
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">GERMATE<small>ENGINEERING MATERIALS</small></div>
      <nav className="nav" aria-label="Navegação principal">
        <a className="active" href="#dashboard">Visão geral</a><a href="#materials">Material Master</a><a href="#documents">Documentos técnicos</a><a href="#audit">Auditoria</a>
      </nav>
      <div className="sidebar-note">Ambiente demo<br />Organização: GERMATE Engenharia</div>
    </aside>
    <main className="main">
      <header className="topbar"><span>Material Engineering Digital Thread</span><div className="avatar">AS</div></header>
      <section className="content" id="dashboard">
        <div className="eyebrow">Material Master · MVP</div><h1>Conhecimento técnico em contexto.</h1>
        <p className="intro">Consulte materiais, revisões e propriedades com rastreabilidade desde a primeira versão.</p>
        <div className="cards"><Metric label="Materiais cadastrados" value="3" /><Metric label="Revisões ativas" value="3" /><Metric label="Em análise" value="1" /><Metric label="Eventos auditáveis" value="12" /></div>
        <div className="toolbar" id="materials"><div><h2>Material Master</h2><span className="muted">Pesquisa por código, nome, classe ou disciplina</span></div><button className="primary" type="button">+ Novo material</button></div>
        <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar materiais..." aria-label="Pesquisar materiais" />
        <div className="table-wrap" style={{ marginTop: 16 }}><table><thead><tr><th>Código</th><th>Material</th><th>Classe</th><th>Disciplina</th><th>Revisão</th><th>Status</th></tr></thead><tbody>{materials.map((material) => <MaterialRow key={material.id} material={material} />)}</tbody></table></div>
      </section>
    </main>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="card"><span className="card-label">{label}</span><strong className="card-value">{value}</strong></div>; }
function MaterialRow({ material }: { material: Material }) { return <tr><td className="code">{material.code}</td><td><strong>{material.name}</strong><br /><span className="muted">{material.group}</span></td><td>{material.className}</td><td>{material.discipline}</td><td>Rev. {material.revision}</td><td><span className="status">{material.status.replace("_", " ")}</span></td></tr>; }
