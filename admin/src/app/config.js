const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const API_URL = `${API_BASE_URL}/api`;
const GRAPHQL_URL = `${API_BASE_URL}/graphql`;
const API_TOKEN = (import.meta.env.VITE_API_TOKEN || "").trim();

if (!API_BASE_URL) throw new Error("Missing VITE_API_BASE_URL in .env.local");
if (!API_TOKEN) throw new Error("Missing VITE_API_TOKEN in .env.local");

export { API_BASE_URL, API_URL, GRAPHQL_URL, API_TOKEN };