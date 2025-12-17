import { API_URL, GRAPHQL_URL, API_TOKEN } from "../app/config";

export async function restFetch(path, { method = "GET", body, headers } = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
            Accept: "application/json",
            ...(body ? { "Content-Type": "application/json" } : {}),
            Authorization: `Bearer ${API_TOKEN}`,
            ...(headers || {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = json?.error?.message || json?.message || "Request failed";
        throw new Error(msg);
    }
    return json;
}

export async function graphqlFetch({ query, variables }) {
    const res = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ query, variables }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = json?.error?.message || "GraphQL request failed";
        throw new Error(msg);
    }
    if (json?.errors?.length) {
        throw new Error(json.errors[0]?.message || "GraphQL error");
    }
    return json.data;
}

export async function uploadToEntity({
                                         files,
                                         ref,
                                         refId,
                                         field,
                                     }) {
    if (!files || files.length === 0) return;

    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    form.append("ref", ref);
    form.append("refId", String(refId));
    form.append("field", field);

    const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${API_TOKEN}` },
        body: form,
    });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const msg = json?.error?.message || "Upload failed";
        throw new Error(msg);
    }
}
