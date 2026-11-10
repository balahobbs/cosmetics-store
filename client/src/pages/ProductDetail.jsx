import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, money } from "../api.js";
import { useCart } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { add } = useCart();
  const navigate = useNavigate();
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => { api(`/products/${id}`).then(setP).catch((e) => setError(e.message)); }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!p) return <p>Loading…</p>;

  return (
    <div className="detail">
      <img src={p.image} alt={p.name} />
      <div>
        <p className="muted">{p.brand} · {p.category}</p>
        <h1>{p.name}</h1>
        <p className="price">{money(p.price)}</p>
        <p>{p.description}</p>
        <p className="muted">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</p>
        {p.stock > 0 && (
          <div className="row gap">
            <input type="number" min="1" max={p.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))} className="qty" />
            <button className="btn" onClick={() => { add(p, qty); navigate("/cart"); }}>Add to cart</button>
          </div>
        )}
      </div>
    </div>
  );
}
