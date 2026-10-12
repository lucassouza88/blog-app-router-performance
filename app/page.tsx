import Link from "next/link"
import { getArtigos } from "@/lib/artigos"

export const dynamic = "force-static"

export default async function HomePage() {
  const artigos = await getArtigos()

  return (
    <main className="container">
      <h1 className="page-title">Artigos</h1>

      <div className="grid">
        {artigos.map((artigo) => (
          <div key={artigo.slug} className="card">
            <h2>{artigo.titulo}</h2>
            <p>
              {artigo.autor} • {artigo.data}
            </p>

            <p>{artigo.resumo}</p>

            <Link className="link" href={`/artigos/${artigo.slug}`}>
              Ler artigo →
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
