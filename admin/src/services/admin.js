import { restFetch, graphqlFetch, uploadToEntity } from "./strapi";
import { updateProductStock } from "./stock";

// REST collections
export async function fetchCollection(collection) {
    if (collection === "users") {
        const res = await restFetch(`/users?populate=*`);
        return Array.isArray(res) ? res : [];
    }
    const res = await restFetch(`/${collection}?populate=*&pagination[pageSize]=100&sort=createdAt:desc`);
    return res?.data || [];
}

export async function deleteEntity(view, id) {
    await restFetch(`/${view}/${id}`, { method: "DELETE" });
}

export function getStrapiModelUid(view) {
    switch (view) {
        case "marques":
            return "api::marque.marque";
        case "categories":
            return "api::category.category";
        case "pieces":
            return "api::piece.piece";
        default:
            return "";
    }
}

export async function saveEntity({
                                     view,
                                     editingItem,
                                     payload,
                                     files,
                                 }) {
    let method = "POST";
    let url = `/${view}`;
    if (editingItem) {
        const id = editingItem.documentId || editingItem.id;
        url = `/${view}/${id}`;
        method = "PUT";
    }

    const res = await restFetch(url, {
        method,
        body: { data: payload },
    });

    const entityId = res?.data?.id;
    if (files?.length && entityId) {
        await uploadToEntity({
            files,
            ref: getStrapiModelUid(view),
            refId: entityId,
            field: view === "pieces" ? "Photos" : "Logo",
        });
    }

    return res;
}

// USERS (users-permissions): payload WITHOUT {data:{}}
export async function fetchUserRoles() {
    const res = await restFetch(`/users-permissions/roles`);
    return res?.roles || res?.data || [];
}

export async function saveUser({ editingItem, payload }) {
    let method = "POST";
    let url = `/users`;

    if (editingItem) {
        method = "PUT";
        url = `/users/${editingItem.id}`;
        if (!payload.password) delete payload.password;
    }

    const res = await restFetch(url, {
        method,
        body: payload,
        headers: { "Content-Type": "application/json" },
    });

    return res;
}

export async function deleteUser(id) {
    await restFetch(`/users/${id}`, { method: "DELETE" });
}

// Orders via GraphQL
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
    const data = await graphqlFetch({ query });
    return data?.orders || [];
}

export async function updateOrderStatus({ order, newState }) {
    // restore stock on cancel/reject
    if (newState === "cancelled" || newState === "rejected") {
        const pieces = order?.pieces || [];
        for (const p of pieces) {
            if (p?.documentId) await updateProductStock(p.documentId, +1);
        }
    }

    await restFetch(`/orders/${order.documentId}`, {
        method: "PUT",
        body: { data: { state: newState } },
    });
}
