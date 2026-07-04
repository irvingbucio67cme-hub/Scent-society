import { readFileSync } from "fs"

const BASE_URL = "http://localhost:9000"
const catalog = JSON.parse(readFileSync("/tmp/perfume_catalog.json", "utf-8"))

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
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
  })
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

const SIZE_ORDER = ["3ml", "5ml", "10ml", "100ml"]

async function main() {
  const token = await login()
  console.log("Autenticado.")

  const { product_categories: existingCats } = await api(token, "/admin/product-categories?limit=100")
  const catByName = {}
  for (const name of ["Hombre", "Mujer"]) {
    let cat = existingCats.find((c) => c.name === name)
    if (!cat) {
      const created = await api(token, "/admin/product-categories", {
        method: "POST",
        body: JSON.stringify({ name, is_active: true }),
      })
      cat = created.product_category
      console.log(`Categoría creada: ${name}`)
    }
    catByName[name] = cat.id
  }

  const { sales_channels } = await api(token, "/admin/sales-channels")
  const salesChannel = sales_channels[0]
  const { shipping_profiles } = await api(token, "/admin/shipping-profiles")
  const shippingProfile = shipping_profiles[0]

  const { products: oldProducts } = await api(token, "/admin/products?limit=100")
  for (const p of oldProducts) {
    await api(token, `/admin/products/${p.id}`, { method: "DELETE" })
  }
  console.log(`Eliminados ${oldProducts.length} productos placeholder.`)

  let created = 0
  let failed = 0
  for (const [, item] of Object.entries(catalog)) {
    const sizes = SIZE_ORDER.filter((s) => item.variants[s])
    if (!sizes.length) continue

    const title = item.name
      .toLowerCase()
      .split(" ")
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ")

    try {
      await api(token, "/admin/products", {
        method: "POST",
        body: JSON.stringify({
          title,
          status: "published",
          categories: [{ id: catByName[item.gender] }],
          options: [{ title: "Presentación", values: sizes }],
          variants: sizes.map((size) => ({
            title: size,
            sku: `${title.replace(/\s+/g, "-").toUpperCase()}-${size}`,
            manage_inventory: false,
            options: { Presentación: size },
            prices: [{ amount: item.variants[size].price, currency_code: "mxn" }],
          })),
          sales_channels: [{ id: salesChannel.id }],
          shipping_profile_id: shippingProfile.id,
        }),
      })
      created++
    } catch (err) {
      failed++
      console.error(`Error en "${title}":`, err.message.slice(0, 200))
    }
  }
  console.log(`Listo. ${created} productos creados, ${failed} con error.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
