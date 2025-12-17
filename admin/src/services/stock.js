import { API_URL, API_TOKEN } from "../app/config";

/**
 * Increment (+) or decrement (-) stock for a piece (Strapi REST)
 */
export async function updateProductStock(pieceId, adjustment) {
    // 1) Get current stock
    const getRes = await fetch(`${API_URL}/pieces/${pieceId}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    const getJson = await getRes.json();
    const currentStock = getJson?.data?.Stock ?? 0;

    // 2) Compute new stock
    const newStock = Math.max(0, Number(currentStock) + Number(adjustment || 0));

    // 3) Update
    const putRes = await fetch(`${API_URL}/pieces/${pieceId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ data: { Stock: newStock } }),
    });

    if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Stock update failed");
    }

    return newStock;
}
