import { API_TOKEN } from "../app/config";
import { rest } from "./strapi";

export const updateProductStock = async (pieceId, adjustment) => {
    // 1) read current
    const getRes = await rest(`/pieces/${pieceId}`, { token: API_TOKEN });
    const currentStock = getRes.json?.data?.Stock || 0;

    // 2) compute new
    const newStock = Math.max(0, currentStock + adjustment);

    // 3) update
    await rest(`/pieces/${pieceId}`, {
        method: "PUT",
        token: API_TOKEN,
        body: { data: { Stock: newStock } },
    });
};
