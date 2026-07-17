"use client"

import { useState } from "react"
import Link from "next/link"

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo/perfumes", label: "Perfumes" },
  { href: "/catalogo/decants", label: "Decants" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
]

export default function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="sm:hidden">
      <button
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span className="h-px w-6 bg-ink" />
        <span className="h-px w-6 bg-ink" />
        <span className="h-px w-6 bg-ink" />
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-full z-40 flex flex-col gap-4 border-b border-gold/30 bg-cream px-6 py-6 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-ink/80 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
