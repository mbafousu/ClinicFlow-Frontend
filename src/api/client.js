const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    // Safe JSON parsing 
    let data;
    const text = await response.text();
    data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API ERROR:", error.message);

    throw new Error(
      error.message || "Network error. Please check your connection."
    );
  }
}