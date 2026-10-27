const BASE = "https://dummyjson.com/products";
const USD_TO_INR = 85;

const prettify = (slug) =>
  slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

export function mapProduct(p) {
  const price = Math.round(p.price * USD_TO_INR);
  const oldPrice = Math.round((p.price / (1 - p.discountPercentage / 100)) * USD_TO_INR);
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    categoryLabel: prettify(p.category),
    brand: p.brand || "",
    tags: p.tags || [],
    price,
    oldPrice: Math.max(oldPrice, price),
    rating: p.rating,
    image: p.thumbnail,
  };
}

export async function fetchProducts() {
  const res = await fetch(`${BASE}?limit=200`);
  if (!res.ok) throw new Error("Failed to load products");
  const data = await res.json();
  return data.products.map(mapProduct);
}

export async function fetchProduct(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return mapProduct(await res.json());
}
