import { gql, rest } from "./strapi";
import { API_TOKEN } from "../app/config";

export const loginCustomer = async ({ identifier, password }) => {
    // 1) Login via REST
    const { ok, json } = await rest("/auth/local", {
        method: "POST",
        token: "", // Strapi auth/local does NOT require API token
        body: { identifier, password },
    });

    if (!ok || !json?.jwt) {
        const msg = json?.error?.message || "Identifiants incorrects.";
        throw new Error(msg);
    }

    const userEmail = json.user?.email;
    const fallbackUserId = json.user?.documentId || json.user?.id;

    // 2) Role check via GraphQL using MASTER token
    const query = `
    query UsersPermissionsUsers($filters: UsersPermissionsUserFiltersInput) {
      usersPermissionsUsers(filters: $filters) {
        documentId
        username
        email
        user_role { name }
      }
    }
  `;

    const data = await gql(query, { filters: { email: { eq: userEmail } } }, API_TOKEN);
    const user = data?.usersPermissionsUsers?.[0];
    const role = user?.user_role?.name?.toLowerCase();

    if (role !== "customer") {
        throw new Error("Accès refusé. Espace réservé aux Clients.");
    }

    return {
        userId: user?.documentId || fallbackUserId,
        email: userEmail,
        role,
    };
};
