export default function Footer() {
  return (
    <footer className="bg-cream text-ink/70 border-t border-gold/30 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl text-ink tracking-[0.1em]">SCENT SOCIETY</p>
          <p className="mt-3 text-sm leading-relaxed">
            Perfumes originales en Ciudad Juárez, Chihuahua. Entregas locales en
            Ciudad Juárez y El Paso, TX.
          </p>
        </div>
        <div>
          <p className="text-ink text-sm font-medium mb-3">Ayuda</p>
          <ul className="space-y-2 text-sm">
            <li>Envíos y entregas</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>
        <div>
          <p className="text-ink text-sm font-medium mb-3">Contacto</p>
          <ul className="space-y-2 text-sm">
            <li>Ciudad Juárez, Chihuahua</li>
            <li>El Paso, TX</li>
            <li>hola@scentsociety.mx</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gold/30 py-4 text-center text-xs">
        © {new Date().getFullYear()} Scent Society. Todos los derechos reservados.
      </div>
    </footer>
  )
}
