import Link from "next/link"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export default function Header() {
  return (
    <header className="bg-charcoal text-cream">
      <div className="border-b border-white/10 text-center text-xs tracking-wide py-2 px-4">
        Envío el mismo día en Ciudad Juárez · Perfumes 100% originales
      </div>
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl tracking-[0.15em]">
          SCENT SOCIETY
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-cream/80 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
