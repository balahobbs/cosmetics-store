// Small fetch wrapper: adds the JWT, parses JSON, throws readable errors.
export async function api(path, { method = "GET", body } = {}) {
  const saved = JSON.parse(localStorage.getItem("cs_user") || "null");
  const res = await fetch(`/api${path}`, {
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
