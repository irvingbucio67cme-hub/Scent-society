import Link from "next/link"
import Image from "next/image"
import { formatMXN } from "@/lib/data/products"
import type { StoreProduct } from "@/lib/data/products"

function BottleIcon() {
  return (
    <svg
      viewBox="0 0 48 64"
      className="h-20 w-14 text-gold/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="18" y="4" width="12" height="8" rx="1.5" />
      <path d="M20 12h8v6.5c4 2.5 6 6 6 11.5v26a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V30c0-5.5 2-9 6-11.5V12Z" />
      <line x1="14" y1="34" x2="34" y2="34" />
    </svg>
  )
}

export default function ProductCard({ product }: { product: StoreProduct }) {
  const price = product.variants?.[0]?.calculated_price?.calculated_amount
  const imageUrl = product.thumbnail || product.images?.[0]?.url

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group block rounded-sm border border-line bg-white/60 transition-shadow hover:shadow-lg"
    >
      <div className="relative flex items-center justify-center bg-gradient-to-b from-cream to-line/60 py-10 h-[220px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <BottleIcon />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-gold-dark">{product.subtitle}</p>
        <h3 className="font-display text-lg mt-1 text-ink">{product.title}</h3>
        {price !== undefined && (
          <p className="mt-2 text-sm text-ink/80">{formatMXN(price)}</p>
        )}
      </div>
    </Link>
  )
}
