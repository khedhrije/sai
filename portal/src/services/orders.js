import { API_TOKEN } from "../app/config";
import { rest } from "./strapi";

export const fetchUserOrders = async (userId) => {
    const { ok, json } = await rest("/orders?populate=*&sort=createdAt:desc", { token: API_TOKEN });
    if (!ok) return [];

    const allOrders = json?.data || [];
    return allOrders.filter((order) => {
        const orderUserId = order.user?.documentId || order.user?.id || order.attributes?.user?.data?.id;
        return String(orderUserId) === String(userId);
    });
};

export const cancelOrder = async (orderId) => {
    return rest(`/orders/${orderId}`, {
        method: "PUT",
        token: API_TOKEN,
        body: { data: { state: "cancelled" } },
    });
};

export const createOrder = async ({ amount, pieceIds, userId }) => {
    return rest("/orders", {
        method: "POST",
        token: API_TOKEN,
        body: {
            data: {
                amount,
                pieces: pieceIds,
                user: userId,
            },
        },
    });
};
