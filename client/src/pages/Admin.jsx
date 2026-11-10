import { useEffect, useState } from "react";
import { api, money } from "../api.js";

const EMPTY = { name: "", brand: "", category: "Skincare", price: "", stock: "", image: "", description: "" };
const STATUSES = ["Placed", "Packed", "Shipped", "Delivered", "Cancelled"];

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    api("/products?limit=100").then((d) => setProducts(d.products)).catch((e) => setError(e.message));
    api("/orders").then(setOrders).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing) await api(`/products/${editing}`, { method: "PUT", body });
      else await api("/products", { method: "POST", body });
      setForm(EMPTY); setEditing(null); load();
    } catch (err) { setError(err.message); }
  };

  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    await api(`/products/${id}`, { method: "DELETE" });
    load();
  };

  const setStatus = async (id, status) => {
    await api(`/orders/${id}/status`, { method: "PUT", body: { status } });
    load();
  };

  const input = (k, label, type = "text") => (
    <label>{label}
      <input required={k !== "image" && k !== "description"} type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    </label>
  );

  return (
    <div>
      <h1>Admin</h1>
      <div className="tabs">
        <button className={tab === "products" ? "on" : ""} onClick={() => setTab("products")}>Products</button>
        <button className={tab === "orders" ? "on" : ""} onClick={() => setTab("orders")}>Orders</button>
      </div>
      {error && <p className="error">{error}</p>}

      {tab === "products" ? (
        <>
          <form onSubmit={save} className="admin-form">
            <h2>{editing ? "Edit product" : "Add product"}</h2>
            {input("name", "Name")}
            {input("brand", "Brand")}
            <label>Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Skincare", "Makeup", "Haircare", "Fragrance", "Bath & Body"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            {input("price", "Price (₹)", "number")}
            {input("stock", "Stock", "number")}
            {input("image", "Image URL")}
            {input("description", "Description")}
            <div className="row gap">
              <button className="btn">{editing ? "Save changes" : "Add product"}</button>
              {editing && <button type="button" className="link" onClick={() => { setEditing(null); setForm(EMPTY); }}>Cancel</button>}
            </div>
          </form>
          <table>
            <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}<br /><span className="muted">{p.brand}</span></td>
                  <td>{p.category}</td><td>{money(p.price)}</td><td>{p.stock}</td>
                  <td>
                    <button className="link" onClick={() => { setEditing(p._id); setForm({ ...EMPTY, ...p }); window.scrollTo(0, 0); }}>Edit</button>{" "}
                    <button className="link danger" onClick={() => del(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6)}</td>
                <td>{o.user?.name}<br /><span className="muted">{o.user?.email}</span></td>
                <td>{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                <td>{money(o.totalPrice)}</td>
                <td>
                  <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
