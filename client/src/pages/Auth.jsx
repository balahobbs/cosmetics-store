import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Auth() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) { setError(err.message); }
  };

  return (
    <form onSubmit={submit} className="auth">
      <h1>{mode === "login" ? "Log in" : "Create your account"}</h1>
      {mode === "register" && (
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
      )}
      <label>Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input required type="password" minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn">{mode === "login" ? "Log in" : "Create account"}</button>
      <button type="button" className="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
      </button>
    </form>
  );
}
