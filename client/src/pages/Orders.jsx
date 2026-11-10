import { useEffect, useState } from "react";
import { api, money } from "../api.js";

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => { api("/orders/mine").then(setOrders).catch((e) => setError(e.message)); }, []);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p>Loading…</p>;
  if (orders.length === 0) return <p>You haven't placed any orders yet.</p>;

  return (
    <div>
      <h1>My orders</h1>
      {orders.map((o) => (
        <div className="order" key={o._id}>
          <div className="row">
            <strong>Order #{o._id.slice(-6)}</strong>
            <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
          </div>
          <p className="muted">{new Date(o.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })} · {o.paymentMethod}</p>
          <ul>{o.items.map((i) => <li key={i.product}>{i.qty} × {i.name} ({money(i.price)})</li>)}</ul>
          <strong>Total {money(o.totalPrice)}</strong>
        </div>
      ))}
    </div>
  );
}
