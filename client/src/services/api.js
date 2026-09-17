const API = import.meta.env.VITE_API_URL || "https://store-inventory-nbwp.onrender.com/";

function authHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function api(path, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });
  const data = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:expired"));
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
