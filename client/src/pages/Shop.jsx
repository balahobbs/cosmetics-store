import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductCard from "../components/ProductCard.jsx";

const CATEGORIES = ["All", "Skincare", "Makeup", "Haircare", "Fragrance", "Bath & Body"];

export default function Shop() {
  const [filters, setFilters] = useState({ search: "", category: "All", brand: "", maxPrice: "", sort: "newest", page: 1 });
  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const set = (patch) => setFilters((f) => ({ ...f, page: 1, ...patch }));

  useEffect(() => { api("/products/brands").then(setBrands).catch(() => {}); }, []);

  // debounce so we don't call the API on every keystroke
  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      setError("");
      const q = new URLSearchParams(Object.entries(filters).filter(([, v]) => v !== "" && v !== "All")).toString();
      try { setData(await api(`/products?${q}`)); }
      catch (e) { setError(e.message); }
      finally { setLoading(false); }
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  return (
    <div className="shop">
      <aside className="filters">
        <label>Search
          <input placeholder="Serum, lipstick, Lumen…" value={filters.search} onChange={(e) => set({ search: e.target.value })} />
        </label>
        <label>Category
          <select value={filters.category} onChange={(e) => set({ category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Brand
          <select value={filters.brand} onChange={(e) => set({ brand: e.target.value })}>
            <option value="">All brands</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label>Max price (₹)
          <input type="number" min="0" placeholder="e.g. 800" value={filters.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })} />
        </label>
        <label>Sort by
          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
        <button className="link" onClick={() => set({ search: "", category: "All", brand: "", maxPrice: "", sort: "newest" })}>
          Clear filters
        </button>
      </aside>

      <section>
        <h1>{filters.category === "All" ? "All products" : filters.category}</h1>
        <p className="muted">{data.total} {data.total === 1 ? "product" : "products"}</p>
        {error && <p className="error">{error}</p>}
        {loading ? <p>Loading…</p> : data.products.length === 0 ? (
          <p>No products match these filters. Try clearing a filter or searching a different word.</p>
        ) : (
          <div className="grid">{data.products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}
        {data.pages > 1 && (
          <div className="pager">
            <button className="btn small ghost" disabled={filters.page <= 1} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}>Previous</button>
            <span>Page {filters.page} of {data.pages}</span>
            <button className="btn small ghost" disabled={filters.page >= data.pages} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>Next</button>
          </div>
        )}
      </section>
    </div>
  );
}
