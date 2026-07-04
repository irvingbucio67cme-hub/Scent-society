import { readFileSync } from "fs"
import path from "path"

const BASE_URL = "http://localhost:9000"
const IMG_DIR = "/Users/mac/Desktop/Bucio/product-images"

const FILE_TO_PRODUCT = {
  "Hugo Energise.jpeg": "Hugo Energise",
  "Insurection.jpeg": "Insurection",
  "Invictus Elixir.jpeg": "Invictus Elixir",
  "Lattsfa Radio.jpeg": "Lattafa Radio",
  "Mandarin Sky Elixir.jpeg": "Mandarin Sky Elixir",
  "Hawas Ice.jpeg": "Hawas Ice",
  "Hayaati Black.jpeg": "Hayaati Black",
  "Hollister Mens Canyon.jpeg": "Hollister Mens Canyon",
  "Hugo  Boss No1.jpeg": "Hugo Boss  No1",
  "Hugo  Boss Dark.jpeg": "Hugo Boss Dark",
  "Halloween Rock On.jpeg": "Halloween Rock On",
}

async function login() {
  const res = await fetch(`${BASE_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@scentsociety.com", password: "ScentSociety2026!" }),
  })
  const { token } = await res.json()
  return token
}

async function api(token, path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
  })
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  const token = await login()
  console.log("Autenticado.")

  for (const [filename, productTitle] of Object.entries(FILE_TO_PRODUCT)) {
    const filePath = path.join(IMG_DIR, filename)
    const buffer = readFileSync(filePath)
    const safeName = filename
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + ".jpg"
    const form = new FormData()
    form.append("files", new Blob([buffer], { type: "image/jpeg" }), safeName)

    const { files } = await api(token, "/admin/uploads", { method: "POST", body: form })
    const url = files[0].url

    const { products } = await api(token, `/admin/products?title=${encodeURIComponent(productTitle)}&limit=1`)
    if (!products.length) {
      console.error(`No se encontró el producto: "${productTitle}" (archivo ${filename})`)
      continue
    }
    await api(token, `/admin/products/${products[0].id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: [{ url }] }),
    })
    console.log(`Imagen asignada: ${productTitle}`)
  }
  console.log("Listo.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
