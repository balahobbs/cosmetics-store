import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("cs_cart") || "[]"));

  useEffect(() => localStorage.setItem("cs_cart", JSON.stringify(items)), [items]);

  const add = (product, qty = 1) =>
    setItems((prev) => {
      const found = prev.find((i) => i.product._id === product._id);
      if (found)
        return prev.map((i) =>
          i.product._id === product._id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
        );
      return [...prev, { product, qty: Math.min(qty, product.stock) }];
    });

  const setQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.product._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.product.stock)) } : i))
    );

  const remove = (id) => setItems((prev) => prev.filter((i) => i.product._id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.product.price, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}
