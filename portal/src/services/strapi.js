import { API_TOKEN, API_URL, GRAPHQL_URL } from "../app/config";

export const gql = async (query, variables = {}, token = API_TOKEN) => {
    const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json?.errors?.length) {
        throw new Error(json.errors[0]?.message || "GraphQL error");
    }
    return json?.data;
};

export const rest = async (path, { method = "GET", token = API_TOKEN, body } = {}) => {
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, json };
};
