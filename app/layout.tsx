import "./globals.css"

export const metadata = {
  title: "Blog Next.js",
  description: "Blog criado com Next.js 15 e App Router",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="header">
          <p className="brand">🚀 Blog Next.js</p>
        </header>
        {children}
      </body>
    </html>
  )
}
