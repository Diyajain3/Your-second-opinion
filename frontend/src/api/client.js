const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const API_BASE = rawBase.replace(/\/+$/, "");

export async function request(path, options = {}) {
  // Check localStorage first, fallback to sessionStorage to prevent token loss on mobile tab reloads
  const token =
    localStorage.getItem("second-opinion-token") ||
    sessionStorage.getItem("second-opinion-token");
    
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE}${cleanPath}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}
