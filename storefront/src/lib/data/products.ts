import { sdk } from "@/lib/medusa"

export type StoreProduct = {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  thumbnail: string | null
  images: { url: string }[]
  variants: {
    id: string
    title: string
    calculated_price?: { calculated_amount: number; currency_code: string }
  }[]
}

export async function listProducts(): Promise<StoreProduct[]> {
  const { products } = await sdk.store.product.list({
    region_id: await getRegionId(),
    fields: "id,title,subtitle,description,thumbnail,*images,*variants.calculated_price",
  })
  return products as unknown as StoreProduct[]
}

let cachedRegionId: string | null = null

export async function getRegionId(): Promise<string | undefined> {
  if (cachedRegionId) return cachedRegionId
  const { regions } = await sdk.store.region.list()
  const mx = regions.find((r) => r.currency_code === "mxn") || regions[0]
  cachedRegionId = mx?.id ?? null
  return cachedRegionId ?? undefined
}

export function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(amount)
}
