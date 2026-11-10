import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, money } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [addr, setAddr] = useState({ fullName: "", address: "", city: "", postalCode: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (items.length === 0)
    return <p>Your cart is empty. <Link to="/">Browse products</Link></p>;

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    setBusy(true);
    setError("");
    try {
      await api("/orders", {
        method: "POST",
        body: {
          items: items.map((i) => ({ product: i.product._id, qty: i.qty })),
          shippingAddress: addr,
          paymentMethod,
        },
      });
      clear();
      navigate("/orders");
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  const field = (name, label, type = "text") => (
    <label>{label}
      <input required type={type} value={addr[name]} onChange={(e) => setAddr({ ...addr, [name]: e.target.value })} />
    </label>
  );

  return (
    <div className="cart">
      <section>
        <h1>Your cart</h1>
        {items.map(({ product: p, qty }) => (
          <div className="line" key={p._id}>
            <img src={p.image} alt="" />
            <div className="grow">
              <strong>{p.name}</strong>
              <p className="muted">{p.brand} · {money(p.price)}</p>
            </div>
            <input type="number" className="qty" min="1" max={p.stock} value={qty} onChange={(e) => setQty(p._id, Number(e.target.value))} />
            <strong>{money(p.price * qty)}</strong>
            <button className="link" onClick={() => remove(p._id)}>Remove</button>
          </div>
        ))}
        <p className="total">Total: {money(total)}</p>
      </section>

      <form onSubmit={placeOrder} className="checkout">
        <h2>Delivery details</h2>
        {field("fullName", "Full name")}
        {field("address", "Address")}
        {field("city", "City")}
        {field("postalCode", "Postal code")}
        {field("phone", "Phone", "tel")}
        <label>Payment
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="COD">Cash on delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn" disabled={busy}>{user ? (busy ? "Placing order…" : "Place order") : "Log in to place order"}</button>
      </form>
    </div>
  );
}
