import React, { useEffect, useMemo, useState } from "react";
import { Edit, Loader, Trash2, UserCheck } from "lucide-react";

import Button from "../components/ui/Button";
import EntityModal from "../components/modals/EntityModal";
import DeleteConfirmationModal from "../components/modals/DeleteConfirmationModal";

import { API_URL, API_TOKEN } from "../app/config";
import { fetchUserRoles } from "../services/roles";

function extractAuthenticatedRoleIdFromUsers(users) {
    if (!Array.isArray(users)) return null;

    for (const u of users) {
        const r = u?.role;
        if (!r) continue;

        const type = String(r.type || "").toLowerCase();
        const name = String(r.name || "").toLowerCase();

        if (type === "authenticated" || name === "authenticated") return r.id ?? null;
    }

    // fallback (in case type/name missing)
    return users?.[0]?.role?.id ?? null;
}

export default function UsersView({ showToast }) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // ✅ Business roles (MANAGER / CUSTOMER) from your entity user-role
    const [relationUserRoles, setRelationUserRoles] = useState([]);

    // ✅ Strapi technical role id (required by /api/users payload),
    // derived from /api/users?populate=* (NO /users-permissions/roles call)
    const [defaultStrapiRoleId, setDefaultStrapiRoleId] = useState(null);

    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/users?populate=*`, {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    Accept: "application/json",
                },
            });

            const json = await res.json();
            const arr = Array.isArray(json) ? json : [];
            setUsers(arr);

            const roleId = extractAuthenticatedRoleIdFromUsers(arr);
            setDefaultStrapiRoleId(roleId);
        } catch (e) {
            console.error(e);
            showToast?.("Erreur de chargement des utilisateurs", "error");
        } finally {
            setLoading(false);
        }
    };

    const loadBusinessRoles = async () => {
        try {
            const roles = await fetchUserRoles();
            setRelationUserRoles(roles || []);
        } catch (e) {
            console.error(e);
            showToast?.("Erreur de chargement des rôles business", "error");
        }
    };

    useEffect(() => {
        loadUsers();
        loadBusinessRoles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;
        return users.filter((u) => {
            const username = (u.username || "").toLowerCase();
            const email = (u.email || "").toLowerCase();
            return username.includes(q) || email.includes(q);
        });
    }, [users, search]);

    const openCreate = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEdit = (u) => {
        setEditingItem(u);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (id) => setDeleteId(id);

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`${API_URL}/users/${deleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    Accept: "application/json",
                },
            });

            if (res.ok) {
                showToast?.("Suppression réussie");
                await loadUsers();
            } else {
                const err = await res.json().catch(() => null);
                showToast?.(err?.error?.message || err?.message || "Impossible de supprimer", "error");
            }
        } catch (e) {
            console.error(e);
            showToast?.("Erreur réseau", "error");
        } finally {
            setDeleteId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const form = e.target;
        const formData = new FormData(form);

        // ✅ Base payload
        const payload = {};
        formData.forEach((value, key) => {
            if (key === "confirmed" || key === "blocked" || key === "relation_user_role") return;
            payload[key] = value;
        });

        payload.confirmed = !!form.confirmed?.checked;
        payload.blocked = !!form.blocked?.checked;

        // ✅ Business role: MANAGER / CUSTOMER (your entity user-role)
        const businessRoleId = formData.get("relation_user_role");
        if (businessRoleId) {
            const n = Number(businessRoleId);
            if (!Number.isFinite(n)) {
                showToast?.("Rôle business invalide (id numérique attendu).", "error");
                setIsSaving(false);
                return;
            }
            payload.user_role = n; // ✅ INT
        }

        // ✅ Strapi technical role is required by /api/users
        // We derive it from /api/users?populate=* (no roles endpoint call)
        if (!defaultStrapiRoleId) {
            showToast?.(
                "Impossible de déterminer le rôle Strapi par défaut (Authenticated). Assure-toi qu'au moins un utilisateur existe déjà.",
                "error"
            );
            setIsSaving(false);
            return;
        }
        payload.role = Number(defaultStrapiRoleId);

        // If editing and password left empty, don't send it
        if (editingItem && !payload.password) delete payload.password;

        try {
            const isEdit = !!editingItem;
            const url = isEdit ? `${API_URL}/users/${editingItem.id}` : `${API_URL}/users`;
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json().catch(() => null);

            if (res.ok) {
                showToast?.(isEdit ? "Utilisateur modifié" : "Utilisateur créé");
                setIsModalOpen(false);
                setEditingItem(null);
                await loadUsers();
            } else {
                showToast?.(json?.error?.message || json?.message || "Erreur inconnue", "error");
            }
        } catch (e) {
            console.error(e);
            showToast?.("Erreur technique", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                <div>
                    <h2 className="text-3xl font-black text-neutral-900">Utilisateurs</h2>
                    <p className="text-neutral-500">
                        Rôles business: MANAGER / CUSTOMER (user-role). Rôle Strapi (Authenticated) déduit depuis /api/users.
                    </p>
                </div>

                <div className="flex gap-3">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher (username / email)"
                        className="w-72 max-w-full border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-amber-500"
                    />
                    <Button onClick={openCreate}>Ajouter</Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader className="animate-spin w-10 h-10 text-amber-500" />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Nom d'utilisateur</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Business Role</th>
                            <th className="p-4">Statut</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-neutral-100">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-neutral-50 group">
                                <td className="p-4 font-mono text-xs">#{u.id}</td>
                                <td className="p-4 font-bold text-neutral-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    {u.username}
                                </td>
                                <td className="p-4 text-neutral-600">{u.email}</td>

                                <td className="p-4 text-xs">
                                    {u.user_role ? (
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold border border-blue-100">
                        {u.user_role?.name || u.user_role?.Name || "-"}
                      </span>
                                    ) : (
                                        <span className="text-neutral-400">-</span>
                                    )}
                                </td>

                                <td className="p-4">
                                    {u.blocked ? (
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Bloqué</span>
                                    ) : u.confirmed ? (
                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">Confirmé</span>
                                    ) : (
                                        <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded text-xs font-bold">En attente</span>
                                    )}
                                </td>

                                <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="secondary" onClick={() => openEdit(u)} className="py-1 px-2">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteRequest(u.id)} className="py-1 px-2">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}

                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-neutral-400">
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            <EntityModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                editingItem={editingItem}
                view="users"
                relationUserRoles={relationUserRoles}
                isSaving={isSaving}
            />

            <DeleteConfirmationModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
