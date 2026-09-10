"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Configure o Supabase em .env.local para habilitar a autenticação.");
      return;
    }
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.href = "/";
  }

  return <main className="auth-page">
    <section className="auth-card">
      <div className="eyebrow">GERMATE · Acesso</div>
      <h1>Entrar na plataforma</h1>
      <p className="intro">Use uma conta provisionada na organização do GERMATE.</p>
      <form onSubmit={submit} className="auth-form">
        <label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className="primary" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
      {message && <p className="form-message">{message}</p>}
      <a href="/" className="back-link">Voltar ao modo demo</a>
    </section>
  </main>;
}
