const BASE_URL = "http://localhost:9000"

async function login() {
  const res = await fetch(`${BASE_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@scentsociety.com",
      password: "ScentSociety2026!",
    }),
  })
  const { token } = await res.json()
  return token
}

async function api(token, path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function main() {
  const token = await login()
  const { products } = await api(token, "/admin/products?limit=100&fields=id,title,*variants,*variants.prices")

  for (const product of products) {
    for (const variant of product.variants) {
      const newPrices = variant.prices
        .filter((p) => p.currency_code === "mxn")
        .map((p) => ({ currency_code: p.currency_code, amount: p.amount / 100 }))
      if (!newPrices.length) continue
      await api(token, `/admin/products/${product.id}/variants/${variant.id}`, {
        method: "POST",
        body: JSON.stringify({ prices: newPrices }),
      })
      console.log(`${product.title} — ${variant.title}: corregido a $${newPrices[0].amount} MXN`)
    }
  }
  console.log("Precios corregidos.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
