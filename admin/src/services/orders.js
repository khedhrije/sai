import { API_URL, API_TOKEN } from "../app/config";
import { strapiGraphQL } from "./strapi";
import { updateProductStock } from "./stock";

export async function fetchOrdersGraphQL() {
    const query = `
    query Orders {
      orders(sort: "createdAt:desc", pagination: { limit: 200 }) {
        documentId
        createdAt
        state
        amount
        pieces {
          documentId
          Name
          Price
        }
        user {
          username
          email
        }
      }
    }
  `;

    const data = await strapiGraphQL(query);
    return data?.orders || [];
}

export async function updateOrderStatus(orderId, newState, boardOrders = []) {
    // If cancelling/rejecting => restore stock
    if (newState === "cancelled" || newState === "rejected") {
        const target = boardOrders.find((o) => o.documentId === orderId);
        const pieces = target?.pieces || [];
        for (const p of pieces) {
            if (p?.documentId) await updateProductStock(p.documentId, +1);
        }
    }

    const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ data: { state: newState } }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(json?.error?.message || "Update order status failed");
    }

    return json?.data || null;
}

export async function archiveOrder(orderId) {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ data: { state: "archived" } }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(json?.error?.message || "Archive failed");
    }

    return json?.data || null;
}
