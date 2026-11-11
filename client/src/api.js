
// Small fetch wrapper: adds the JWT, parses JSON, throws readable errors.

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

export async function api(path, { method = "GET", body } = {}) {
  const saved = JSON.parse(localStorage.getItem("cs_user") || "null");

  const res = await fetch(`${API_BASE_URL}/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(saved?.token && { Authorization: `Bearer ${saved.token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Something went wrong");

  return data;
}

export const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
