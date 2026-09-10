"use client";

import { useEffect, useState } from "react";

type AdminData = {
  users: { id: string; displayName: string; email?: string; role: string; isActive: boolean; lastLoginAt?: string }[];
  permissions: { role: string; permissionCode: string; description: string }[];
  parameters: { parameterKey: string; parameterValue: unknown; description: string; updatedAt?: string }[];
  audit: { action: string; entityType: string; actor?: string; createdAt: string }[];
  meta: { source: string };
};

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin").then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Não foi possível carregar a administração.");
      setData(body);
    }).catch((reason: Error) => setError(reason.message));
  }, []);

  if (error) return <main className="auth-page"><section className="auth-card"><div className="eyebrow">IMP-001 · Administração</div><h1>Acesso administrativo</h1><p className="form-message">{error}</p><a className="back-link" href="/">Voltar ao Material Master</a></section></main>;
  if (!data) return <main className="auth-page"><section className="auth-card"><p>Carregando administração...</p></section></main>;
  return <div className="shell">
    <aside className="sidebar"><div className="brand">GERMATE<small>IMP-001 · ADMINISTRAÇÃO</small></div><nav className="nav"><a className="active" href="#users">Usuários e perfis</a><a href="#permissions">Permissões</a><a href="#parameters">Parâmetros</a><a href="#audit">Auditoria</a></nav><div className="sidebar-note">Fonte: {data.meta.source === "demo" ? "modo demo" : "Supabase"}</div></aside>
    <main className="main"><header className="topbar"><span>Administração do Sistema</span><a className="back-link" href="/">Material Master</a><div className="avatar">AD</div></header>
      <section className="content"><div className="eyebrow">IMP-001 · Administração do Sistema</div><h1>Controle, segurança e governança.</h1><p className="intro">Usuários, papéis, parâmetros e eventos administrativos em um só lugar.</p>
        <div className="cards"><div className="card"><span className="card-label">Usuários</span><strong className="card-value">{data.users.length}</strong></div><div className="card"><span className="card-label">Permissões</span><strong className="card-value">{data.permissions.length}</strong></div><div className="card"><span className="card-label">Parâmetros</span><strong className="card-value">{data.parameters.length}</strong></div><div className="card"><span className="card-label">Eventos recentes</span><strong className="card-value">{data.audit.length}</strong></div></div>
        <AdminTable id="users" title="Usuários e perfis"><table><thead><tr><th>Usuário</th><th>Papel</th><th>Status</th><th>Último acesso</th></tr></thead><tbody>{data.users.map((user) => <tr key={user.id}><td><strong>{user.displayName}</strong>{user.email && <><br /><span className="muted">{user.email}</span></>}</td><td>{user.role.replaceAll("_", " ")}</td><td><span className="status">{user.isActive ? "ATIVO" : "INATIVO"}</span></td><td>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("pt-BR") : "—"}</td></tr>)}</tbody></table></AdminTable>
        <AdminTable id="permissions" title="Matriz de permissões"><table><thead><tr><th>Papel</th><th>Permissão</th><th>Descrição</th></tr></thead><tbody>{data.permissions.map((permission) => <tr key={permission.role + permission.permissionCode}><td>{permission.role.replaceAll("_", " ")}</td><td className="code">{permission.permissionCode}</td><td>{permission.description}</td></tr>)}</tbody></table></AdminTable>
        <AdminTable id="parameters" title="Parâmetros do sistema"><table><thead><tr><th>Chave</th><th>Valor</th><th>Descrição</th></tr></thead><tbody>{data.parameters.map((parameter) => <tr key={parameter.parameterKey}><td className="code">{parameter.parameterKey}</td><td>{String(parameter.parameterValue)}</td><td>{parameter.description}</td></tr>)}</tbody></table></AdminTable>
        <AdminTable id="audit" title="Auditoria recente"><table><thead><tr><th>Data/hora</th><th>Ator</th><th>Operação</th><th>Entidade</th></tr></thead><tbody>{data.audit.map((event, index) => <tr key={event.createdAt + index}><td>{new Date(event.createdAt).toLocaleString("pt-BR")}</td><td>{event.actor ?? "Sistema"}</td><td>{event.action}</td><td>{event.entityType}</td></tr>)}</tbody></table></AdminTable>
      </section>
    </main>
  </div>;
}

function AdminTable({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section id={id} style={{ marginTop: 28 }}><div className="toolbar"><h2>{title}</h2></div><div className="table-wrap">{children}</div></section>;
}
