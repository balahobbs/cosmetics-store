import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <header className="nav">
      <Link to="/" className="brand">Hobbs Cosmatics</Link>
      <nav>
        <NavLink to="/">Shop</NavLink>
        {user && <NavLink to="/orders">My orders</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        <NavLink to="/cart">Cart{count > 0 && <span className="badge">{count}</span>}</NavLink>
        {user ? (
          <button className="link" onClick={() => { logout(); navigate("/"); }}>
            Log out ({user.name.split(" ")[0]})
          </button>
        ) : (
          <NavLink to="/login">Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
