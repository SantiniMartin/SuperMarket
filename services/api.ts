const BASE_URL = 'https://dummyjson.com';

export async function fetchProducts() {
  const res = await fetch(`${BASE_URL}/products?limit=100`);
  const data = await res.json();
  return data.products;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/category-list`);
  return res.json();
}

export async function fetchProductsByCategory(category: string, limit = 10, skip = 0) {
  const res = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`);
  const data = await res.json();
  // Solo productos con oferta
  return data.products.filter((p: any) => p.discountPercentage && p.discountPercentage > 0);
} 