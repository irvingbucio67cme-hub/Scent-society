import Link from "next/link"
import MobileMenu from "./MobileMenu"

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo/perfumes", label: "Perfumes" },
  { href: "/catalogo/decants", label: "Decants" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export default function Header() {
  return (
    <header className="relative bg-cream text-ink border-b border-gold/30">
      <div className="border-b border-gold/30 text-center text-xs tracking-wide py-2 px-4">
        Entregas el mismo día en Ciudad Juárez · Perfumes 100% originales
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
              className="text-ink/80 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileMenu />
      </div>
    </header>
  )
}
