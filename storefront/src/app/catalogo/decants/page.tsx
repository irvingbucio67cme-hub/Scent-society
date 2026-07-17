import ProductCard from "@/components/ProductCard"
import { listProducts, pickDecantVariant } from "@/lib/data/products"

export const dynamic = "force-dynamic"

export default async function DecantsPage() {
  let products: Awaited<ReturnType<typeof listProducts>> = []
  try {
    products = await listProducts()
  } catch {
    products = []
  }

  const items = products
    .map((product) => ({ product, variant: pickDecantVariant(product) }))
    .filter(
      (item): item is { product: (typeof products)[number]; variant: NonNullable<typeof item.variant> } =>
        !!item.variant
    )

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-display text-3xl text-ink text-center">Decants</h1>
      <p className="mt-2 text-center text-ink/60">
        Presentaciones pequeñas para probar antes de comprar el frasco completo.
      </p>
      {items.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ product, variant }) => (
            <ProductCard key={product.id} product={product} variant={variant} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-ink/60">
          Por el momento no hay decants disponibles.
        </p>
      )}
    </section>
  )
}
