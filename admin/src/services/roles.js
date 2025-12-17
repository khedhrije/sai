import { API_URL, API_TOKEN } from "../app/config";

// ✅ Business roles (your Content-Type) -> /api/user-roles
export async function fetchUserRoles() {
    const res = await fetch(
        `${API_URL}/user-roles?pagination[pageSize]=100&sort=name:asc`,
        {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                Accept: "application/json",
            },
        }
    );

    const json = await res.json();
    return json?.data || [];
}
