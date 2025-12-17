import { API_URL, GRAPHQL_URL, API_TOKEN } from "../app/config";

/**
 * Même logique que portal :
 * - Login via /auth/local (jwt user)
 * - Role check via GraphQL avec API_TOKEN (master token)
 * - Autorise uniquement si role attendu
 */
export async function loginWithRoleCheck({ identifier, password, expectedRole }) {
    // 1) Login (NO master token)
    const loginRes = await fetch(`${API_URL}/auth/local`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
    });

    const loginJson = await loginRes.json().catch(() => ({}));

    if (!loginRes.ok || !loginJson?.jwt) {
        const msg =
            loginJson?.error?.message ||
            loginJson?.message ||
            "Identifiants incorrects.";
        throw new Error(msg);
    }

    const userEmail = loginJson?.user?.email;
    const userDocumentId = loginJson?.user?.documentId || loginJson?.user?.id;

    if (!userEmail) {
        throw new Error("Email manquant sur l'utilisateur.");
    }

    // 2) Role check (GraphQL with MASTER TOKEN)
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

    const roleRes = await fetch(GRAPHQL_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query,
            variables: { filters: { email: { eq: userEmail } } },
        }),
    });

    const roleJson = await roleRes.json().catch(() => ({}));

    if (!roleRes.ok) {
        // typiquement 401 ici si API_TOKEN manquant/invalid
        const msg = roleJson?.error?.message || "Erreur GraphQL (role check).";
        throw new Error(msg);
    }

    if (roleJson?.errors?.length) {
        throw new Error(roleJson.errors[0]?.message || "Erreur GraphQL.");
    }

    const user = roleJson?.data?.usersPermissionsUsers?.[0];
    const role = (user?.user_role?.name || "").toLowerCase();

    if (!role) throw new Error("Rôle introuvable pour cet utilisateur.");

    if (role !== String(expectedRole || "").toLowerCase()) {
        throw new Error(
            expectedRole === "manager"
                ? "Accès refusé. Réservé aux Managers."
                : "Accès refusé."
        );
    }

    return {
        jwt: loginJson.jwt,
        user: {
            id: user?.documentId || userDocumentId,
            username: user?.username || loginJson?.user?.username,
            email: user?.email || userEmail,
            role,
        },
    };
}

/** Helpers pratiques */
export function loginManager({ identifier, password }) {
    return loginWithRoleCheck({ identifier, password, expectedRole: "manager" });
}

export function loginCustomer({ identifier, password }) {
    return loginWithRoleCheck({ identifier, password, expectedRole: "customer" });
}
