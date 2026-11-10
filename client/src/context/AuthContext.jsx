import { createContext, useContext, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("cs_user") || "null"));

  const save = (u) => {
    localStorage.setItem("cs_user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email, password) => save(await api("/auth/login", { method: "POST", body: { email, password } }));
  const register = async (name, email, password) =>
    save(await api("/auth/register", { method: "POST", body: { name, email, password } }));
  const logout = () => {
    localStorage.removeItem("cs_user");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
