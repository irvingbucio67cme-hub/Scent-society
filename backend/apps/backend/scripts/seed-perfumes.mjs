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
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`)
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
  console.log("Autenticado como admin.")

  const { stores } = await api(token, "/admin/stores")
  const store = stores[0]
  await api(token, `/admin/stores/${store.id}`, {
    method: "POST",
    body: JSON.stringify({
      supported_currencies: [
        { currency_code: "mxn", is_default: true },
        { currency_code: "usd" },
      ],
    }),
  })
  console.log("Tienda configurada con MXN como moneda default.")

  const { regions } = await api(token, "/admin/regions")
  let mxRegion = regions.find((r) => r.currency_code === "mxn")
  if (!mxRegion) {
    const created = await api(token, "/admin/regions", {
      method: "POST",
      body: JSON.stringify({
        name: "México",
        currency_code: "mxn",
        countries: ["mx"],
        payment_providers: ["pp_system_default"],
      }),
    })
    mxRegion = created.region
    console.log("Región México creada.")
  } else {
    console.log("Región México ya existía.")
  }

  const { sales_channels } = await api(token, "/admin/sales-channels")
  const salesChannel = sales_channels[0]

  const { shipping_profiles } = await api(token, "/admin/shipping-profiles")
  const shippingProfile = shipping_profiles[0]

  const { products: oldProducts } = await api(token, "/admin/products?limit=100")
  for (const p of oldProducts) {
    await api(token, `/admin/products/${p.id}`, { method: "DELETE" })
    console.log(`Producto demo eliminado: ${p.title}`)
  }

  const perfumes = [
    {
      title: "Sauvage Eau de Parfum",
      brand: "Dior",
      description:
        "Fragancia amaderada y fresca con notas de bergamota de Calabria y pimienta de Sichuan. Nota de fondo de ambroxan.",
      variants: [
        { size: "50ml", price: 2199, sku: "SAV-DIOR-50" },
        { size: "100ml", price: 3299, sku: "SAV-DIOR-100" },
      ],
    },
    {
      title: "Bleu de Chanel Eau de Parfum",
      brand: "Chanel",
      description:
        "Aromática amaderada, cítrico vibrante con base de sándalo y cedro. Un clásico moderno para uso diario.",
      variants: [
        { size: "50ml", price: 2599, sku: "BLU-CHN-50" },
        { size: "100ml", price: 3699, sku: "BLU-CHN-100" },
      ],
    },
    {
      title: "La Vie Est Belle Eau de Parfum",
      brand: "Lancôme",
      description:
        "Floral gourmand con iris, praliné y vainilla. Cálida, dulce y envolvente.",
      variants: [
        { size: "50ml", price: 2299, sku: "LVEB-LCM-50" },
        { size: "100ml", price: 3399, sku: "LVEB-LCM-100" },
      ],
    },
    {
      title: "Black Opium Eau de Parfum",
      brand: "Yves Saint Laurent",
      description:
        "Oriental especiado con café negro, vainilla y flor de naranjo. Intenso y adictivo.",
      variants: [
        { size: "50ml", price: 2199, sku: "BOP-YSL-50" },
        { size: "100ml", price: 3199, sku: "BOP-YSL-100" },
      ],
    },
    {
      title: "Aventus Eau de Parfum",
      brand: "Creed",
      description:
        "Afrutado y ahumado con piña, abedul y bergamota. Una de las fragancias masculinas más icónicas del nicho.",
      variants: [
        { size: "50ml", price: 4599, sku: "AVT-CRD-50" },
        { size: "100ml", price: 6899, sku: "AVT-CRD-100" },
      ],
    },
    {
      title: "Good Girl Eau de Parfum",
      brand: "Carolina Herrera",
      description:
        "Floral amaderado con almendra tostada, jazmín y cacao. Elegante y magnético.",
      variants: [
        { size: "50ml", price: 2199, sku: "GG-CH-50" },
        { size: "100ml", price: 3199, sku: "GG-CH-100" },
      ],
    },
  ]

  for (const perfume of perfumes) {
    await api(token, "/admin/products", {
      method: "POST",
      body: JSON.stringify({
        title: perfume.title,
        subtitle: perfume.brand,
        description: perfume.description,
        status: "published",
        options: [{ title: "Tamaño", values: perfume.variants.map((v) => v.size) }],
        variants: perfume.variants.map((v) => ({
          title: v.size,
          sku: v.sku,
          manage_inventory: false,
          options: { Tamaño: v.size },
          prices: [{ amount: v.price, currency_code: "mxn" }],
        })),
        sales_channels: [{ id: salesChannel.id }],
        shipping_profile_id: shippingProfile.id,
      }),
    })
    console.log(`Perfume creado: ${perfume.title} (${perfume.brand})`)
  }

  console.log("Listo. Catálogo de muestra de perfumes cargado en MXN.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
