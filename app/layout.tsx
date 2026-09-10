import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GERMATE — Gerenciador de Materiais de Engenharia",
  description: "Material Master, rastreabilidade e conhecimento técnico para engenharia."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
