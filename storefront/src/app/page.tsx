import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import { listProducts } from "@/lib/data/products"

export const dynamic = "force-dynamic"

const BADGES = [
  {
    title: "100% originales",
    text: "Cada perfume cuenta con garantía de autenticidad.",
  },
  {
    title: "Entrega el mismo día",
    text: "En Ciudad Juárez, y envíos a todo México.",
  },
  {
    title: "Pago seguro",
    text: "Múltiples métodos de pago protegidos.",
  },
]

export default async function Home() {
  let products: Awaited<ReturnType<typeof listProducts>> = []
  try {
    products = await listProducts()
  } catch {
    products = []
  }

  return (
    <>
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Scent Society</p>
          <h1 className="font-display text-4xl sm:text-5xl mt-4 max-w-2xl mx-auto leading-tight">
            Perfumes originales, sin intermediarios
          </h1>
          <p className="mt-6 text-cream/70 max-w-xl mx-auto">
            Fragancias de las casas más reconocidas del mundo, con garantía de
            autenticidad y entrega local en Ciudad Juárez.
          </p>
          <Link
            href="/catalogo"
            className="inline-block mt-10 bg-gold text-charcoal px-8 py-3 text-sm tracking-wide hover:bg-gold-dark transition-colors"
          >
            Explorar catálogo
          </Link>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 sm:grid-cols-3 text-center">
          {BADGES.map((badge) => (
            <div key={badge.title}>
              <p className="font-display text-lg text-ink">{badge.title}</p>
              <p className="mt-1 text-sm text-ink/60">{badge.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-ink text-center">Destacados</h2>
        {products.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-ink/60">
            No se pudo conectar con el catálogo. Verifica que el backend esté corriendo en
            localhost:9000.
          </p>
        )}
      </section>
    </>
  )
}
