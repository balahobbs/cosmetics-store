import { Link } from "react-router-dom";
import { money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product: p }) {
  const { add } = useCart();
  return (
    <article className="card">
      <Link to={`/product/${p._id}`}>
        <img src={p.image} alt={p.name} loading="lazy" />
      </Link>
      <div className="card-body">
        <p className="muted">{p.brand}</p>
        <h3><Link to={`/product/${p._id}`}>{p.name}</Link></h3>
        <p className="muted">{p.category} · {p.rating.toFixed(1)} rating</p>
        <div className="row">
          <strong>{money(p.price)}</strong>
          {p.stock > 0 ? (
            <button className="btn small" onClick={() => add(p)}>Add to cart</button>
          ) : (
            <span className="muted">Out of stock</span>
          )}
        </div>
      </div>
    </article>
  );
}
