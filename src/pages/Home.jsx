import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api/products";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 24;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => map.set(p.category, p.categoryLabel));
    return [...map.entries()];
  }, [products]);

  const filtered = useMemo(() => {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);

    let list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      const text = `${p.title} ${p.categoryLabel} ${p.brand} ${p.tags.join(" ")} ${p.description}`.toLowerCase();
      return words.every((w) => text.includes(w));
    });

    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    else if (words.length) {
      // best match first: products whose title contains the search words
      const score = (p) => words.filter((w) => p.title.toLowerCase().includes(w)).length;
      list = [...list].sort((a, b) => score(b) - score(a));
    }
    return list;
  }, [products, search, category, sort]);

  const resetPage = () => setVisible(PAGE_SIZE);

  return (
    <>
      <section className="hero">
        <div>
          <p className="hero-tag">New season sale</p>
          <h1>Discover products you will love</h1>
          <p className="hero-sub">Phones, laptops, fashion, beauty and home essentials at great prices.</p>
          <a href="#products" className="btn btn-light">Shop Now</a>
        </div>
      </section>

      <div className="toolbar" id="products">
        <div className="filters wide">
          <input
            type="text"
            placeholder="Search any product, brand or category..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
          />
          <select value={category} onChange={(e) => { setCategory(e.target.value); resetPage(); }}>
            <option value="all">All Categories</option>
            {categories.map(([slug, label]) => (
              <option key={slug} value={slug}>{label}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort by</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {loading && <p className="empty">Loading products...</p>}
      {error && <p className="empty">Something went wrong: {error}</p>}

      {!loading && !error && (
        <>
          <p className="results-info">
            {filtered.length} product{filtered.length !== 1 && "s"} found
            {search && <> for "<strong>{search}</strong>"</>}
          </p>

          {filtered.length === 0 ? (
            <p className="empty">No products found. Try a different word.</p>
          ) : (
            <div className="grid">
              {filtered.slice(0, visible).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="load-more">
              <button className="btn" onClick={() => setVisible(visible + PAGE_SIZE)}>
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
