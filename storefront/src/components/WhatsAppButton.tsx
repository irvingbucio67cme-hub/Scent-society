const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
const DEFAULT_MESSAGE = "Hola, quiero información sobre sus perfumes."

export default function WhatsAppButton() {
  if (!WHATSAPP_NUMBER) return null

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatea con nosotros por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white">
        <path d="M16.004 3C9.377 3 4 8.377 4 15.004c0 2.397.7 4.63 1.92 6.51L4 29l7.66-1.9a11.94 11.94 0 0 0 4.344.81h.005c6.627 0 12.004-5.377 12.004-12.004C28.013 8.38 22.634 3 16.004 3Zm0 21.883h-.004a9.9 9.9 0 0 1-5.05-1.383l-.362-.215-3.797.943.99-3.703-.236-.38a9.86 9.86 0 0 1-1.51-5.14c0-5.463 4.447-9.91 9.973-9.91 2.663 0 5.166 1.038 7.047 2.923a9.9 9.9 0 0 1 2.92 7.05c0 5.463-4.447 9.815-9.97 9.815Zm5.462-7.415c-.298-.15-1.766-.872-2.04-.972-.274-.1-.474-.15-.673.15-.2.298-.772.972-.947 1.172-.174.2-.348.224-.647.075-.298-.15-1.257-.463-2.394-1.475-.885-.79-1.483-1.765-1.657-2.063-.174-.298-.02-.46.13-.61.134-.133.298-.348.448-.523.15-.174.199-.298.298-.497.1-.2.05-.373-.025-.523-.075-.15-.673-1.62-.922-2.22-.243-.583-.49-.504-.673-.513l-.573-.01c-.2 0-.523.075-.797.373s-1.047 1.023-1.047 2.496 1.072 2.895 1.222 3.095c.15.2 2.11 3.222 5.112 4.52.714.308 1.271.492 1.705.63.716.228 1.368.196 1.883.119.575-.086 1.766-.722 2.015-1.42.25-.697.25-1.295.174-1.42-.075-.124-.273-.199-.572-.348Z" />
      </svg>
    </a>
  )
}
