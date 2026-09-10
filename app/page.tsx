"use client";

import { FormEvent, useEffect, useState } from "react";
import { listMaterials, type Material } from "@/lib/domain";

type Catalog = { groups: { id: string; name: string }[]; disciplines: { id: string; name: string }[] };

export default function Home() {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [catalog, setCatalog] = useState<Catalog>({ groups: [], disciplines: [] });
  const [formMessage, setFormMessage] = useState("");
  const [newMaterial, setNewMaterial] = useState({ code: "", name: "", className: "", groupId: "", disciplineId: "" });
  const [materials, setMaterials] = useState<Material[]>(() => listMaterials());
  useEffect(() => {
    fetch("/api/catalog").then((response) => response.json()).then((data) => setCatalog(data)).catch(() => setCatalog({ groups: [], disciplines: [] }));
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch("/api/materials?q=" + encodeURIComponent(query))
        .then((response) => response.ok ? response.json() : Promise.reject(new Error("API indisponível")))
        .then((data) => setMaterials(data.data ?? []))
        .catch(() => setMaterials(listMaterials(query)));
    }, 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  async function createMaterial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");
    const response = await fetch("/api/materials", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(newMaterial) });
    const data = await response.json();
    if (!response.ok) {
      setFormMessage(data.error ?? "Não foi possível criar o material.");
      return;
    }
    setFormMessage("Material criado. A lista será atualizada.");
    setShowForm(false);
    setQuery("");
  }
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand">GERMATE<small>ENGINEERING MATERIALS</small></div>
      <nav className="nav" aria-label="Navegação principal">
        <a className="active" href="#dashboard">Visão geral</a><a href="#materials">Material Master</a><a href="#documents">Documentos técnicos</a><a href="#audit">Auditoria</a><a href="/admin">Administração</a>
      </nav>
      <div className="sidebar-note">Ambiente demo<br />Organização: GERMATE Engenharia</div>
    </aside>
    <main className="main">
      <header className="topbar"><span>Material Engineering Digital Thread</span><div style={{ alignItems: "center", display: "flex", gap: 14 }}><a className="back-link" href="/login">Entrar</a><div className="avatar">AS</div></div></header>
      <section className="content" id="dashboard">
        <div className="eyebrow">Material Master · MVP</div><h1>Conhecimento técnico em contexto.</h1>
        <p className="intro">Consulte materiais, revisões e propriedades com rastreabilidade desde a primeira versão.</p>
        <div className="cards"><Metric label="Materiais cadastrados" value="3" /><Metric label="Revisões ativas" value="3" /><Metric label="Em análise" value="1" /><Metric label="Eventos auditáveis" value="12" /></div>
        <div className="toolbar" id="materials"><div><h2>Material Master</h2><span className="muted">Pesquisa por código, nome, classe ou disciplina</span></div><button className="primary" type="button" onClick={() => setShowForm((value) => !value)}>+ Novo material</button></div>
        {showForm && <form className="material-form" onSubmit={createMaterial}>
          <label>Código<input value={newMaterial.code} onChange={(event) => setNewMaterial({ ...newMaterial, code: event.target.value })} placeholder="MAT-..." required /></label>
          <label>Nome técnico<input value={newMaterial.name} onChange={(event) => setNewMaterial({ ...newMaterial, name: event.target.value })} required /></label>
          <label>Classe<input value={newMaterial.className} onChange={(event) => setNewMaterial({ ...newMaterial, className: event.target.value })} required /></label>
          <label>Grupo<select value={newMaterial.groupId} onChange={(event) => setNewMaterial({ ...newMaterial, groupId: event.target.value })} required><option value="">Selecione</option>{catalog.groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
          <label>Disciplina<select value={newMaterial.disciplineId} onChange={(event) => setNewMaterial({ ...newMaterial, disciplineId: event.target.value })} required><option value="">Selecione</option>{catalog.disciplines.map((discipline) => <option key={discipline.id} value={discipline.id}>{discipline.name}</option>)}</select></label>
          <div className="form-actions"><button className="primary" type="submit">Salvar rascunho</button><button className="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</button></div>
          {formMessage && <p className="form-message">{formMessage}</p>}
        </form>}
        {formMessage && !showForm && <p className="muted">{formMessage}</p>}
        <input className="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Pesquisar materiais..." aria-label="Pesquisar materiais" />
        <div className="table-wrap" style={{ marginTop: 16 }}><table><thead><tr><th>Código</th><th>Material</th><th>Classe</th><th>Disciplina</th><th>Revisão</th><th>Status</th></tr></thead><tbody>{materials.map((material) => <MaterialRow key={material.id} material={material} />)}</tbody></table></div>
      </section>
    </main>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="card"><span className="card-label">{label}</span><strong className="card-value">{value}</strong></div>; }
function MaterialRow({ material }: { material: Material }) { return <tr><td className="code">{material.code}</td><td><strong>{material.name}</strong><br /><span className="muted">{material.group}</span></td><td>{material.className}</td><td>{material.discipline}</td><td>Rev. {material.revision}</td><td><span className="status">{material.status.replace("_", " ")}</span></td></tr>; }
