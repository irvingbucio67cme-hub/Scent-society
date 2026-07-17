import ProductCard from "@/components/ProductCard"
import { listProducts, pickPerfumeVariant } from "@/lib/data/products"

export const dynamic = "force-dynamic"

export default async function PerfumesPage() {
  let products: Awaited<ReturnType<typeof listProducts>> = []
  try {
    products = await listProducts()
  } catch {
    products = []
  }

  const items = products
    .map((product) => ({ product, variant: pickPerfumeVariant(product) }))
    .filter(
      (item): item is { product: (typeof products)[number]; variant: NonNullable<typeof item.variant> } =>
        !!item.variant
    )

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink text-center">Perfumes</h1>
      <p className="mt-2 text-center text-ink/60">Frascos completos, 100% originales.</p>
      {items.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ product, variant }) => (
            <ProductCard key={product.id} product={product} variant={variant} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-ink/60">
          Por el momento no hay perfumes disponibles.
        </p>
      )}
    </section>
  )
}
