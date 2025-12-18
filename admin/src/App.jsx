import { useEffect, useMemo, useState } from "react";
import { Smartphone, Settings, Lock, User, AlertCircle, Loader, Plus } from "lucide-react";

import AdminShell from "./components/layout/AdminShell";
import Button from "./components/ui/Button";
import Toast from "./components/ui/Toast";

import EntityModal from "./components/modals/EntityModal";
import DeleteConfirmationModal from "./components/modals/DeleteConfirmationModal";
import OrderDetailsModal from "./components/modals/OrderDetailsModal";

import DashboardView from "./views/DashboardView";
import OrdersView from "./views/OrdersView";
import UsersView from "./views/UsersView";
import EntitiesView from "./views/EntitiesView";

import { loginManager } from "./services/auth";
import {
    fetchCollection,
    fetchOrdersGraphQL,
    fetchUserRoles,
    saveEntity,
    saveUser,
    deleteEntity,
    deleteUser,
    updateOrderStatus,
} from "./services/admin";

export default function App() {
    // auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // nav
    const [view, setView] = useState("dashboard");
    const [collapsed, setCollapsed] = useState(false);

    // data
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // dashboard stats
    const [stats, setStats] = useState({ orders: 0, revenue: 0, stock: 0, users: 0 });
    const [loadingStats, setLoadingStats] = useState(false);
    const [statsRange, setStatsRange] = useState("month");
    const [boardOrders, setBoardOrders] = useState([]);

    // relations
    const [relationMarques, setRelationMarques] = useState([]);
    const [relationCategories, setRelationCategories] = useState([]);
    const [relationUserRoles, setRelationUserRoles] = useState([]);

    // modals
    const [notification, setNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const showToast = (msg, type = "success") => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");

        try {
            await loginManager({ identifier: username, password });
            setIsAuthenticated(true);
            setView("dashboard");
        } catch (err) {
            setLoginError(err?.message || "Erreur de connexion");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
        setView("dashboard");
        setData([]);
        setOrders([]);
        setBoardOrders([]);
    };

    const loadRelations = async () => {
        try {
            const [m, c, ur] = await Promise.all([
                fetchCollection("marques"),
                fetchCollection("categories"),
                fetchUserRoles(),
            ]);
            setRelationMarques(m || []);
            setRelationCategories(c || []);
            setRelationUserRoles(ur || []);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchDashboardStats = async () => {
        setLoadingStats(true);
        try {
            const now = new Date();
            let start = new Date();

            switch (statsRange) {
                case "day":
                    start.setHours(0, 0, 0, 0);
                    break;
                case "week":
                    start.setDate(now.getDate() - 7);
                    break;
                case "month":
                    start.setDate(now.getDate() - 30);
                    break;
                case "year":
                    start.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    start.setDate(now.getDate() - 30);
            }

            const allOrders = await fetchOrdersGraphQL();
            const filtered = allOrders.filter((o) => new Date(o.createdAt) >= start);

            // pieces meta total (count)
            const piecesMeta = await fetchCollection("pieces");
            const usersList = await fetchCollection("users");

            const revenue = filtered.reduce((acc, o) => acc + (o.amount || 0), 0);

            setStats({
                orders: filtered.length,
                revenue,
                stock: Array.isArray(piecesMeta) ? piecesMeta.length : 0,
                users: Array.isArray(usersList) ? usersList.length : 0,
            });

            setBoardOrders(allOrders || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchCurrentView = async () => {
        setLoading(true);
        try {
            if (view === "orders") {
                const list = await fetchOrdersGraphQL();
                setOrders(list || []);
            } else {
                const list = await fetchCollection(view);
                setData(list || []);
            }
        } catch (e) {
            console.error(e);
            showToast("Erreur de chargement", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;

        loadRelations();

        if (view === "dashboard") {
            fetchDashboardStats();
            return;
        }

        fetchCurrentView();
    }, [isAuthenticated, view, statsRange]);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (!isModalOpen) return;
        if (["pieces", "categories", "users"].includes(view)) loadRelations();
    }, [isAuthenticated, isModalOpen, view]);

    const onDeleteRequest = (id) => setDeleteId(id);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            if (view === "users") await deleteUser(deleteId);
            else await deleteEntity(view, deleteId);

            showToast("Suppression réussie");
            setDeleteId(null);
            await fetchCurrentView();
        } catch (e) {
            console.error(e);
            showToast(e?.message || "Impossible de supprimer", "error");
            setDeleteId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const form = e.target;
            const formData = new FormData(form);

            // users
            if (view === "users") {
                const payload = {};
                formData.forEach((v, k) => {
                    if (k !== "confirmed" && k !== "blocked" && k !== "relation_user_role") payload[k] = v;
                });
                payload.confirmed = !!form.confirmed?.checked;
                payload.blocked = !!form.blocked?.checked;

                const roleId = formData.get("relation_user_role");
                if (roleId) payload.role = Number(roleId);

                await saveUser({ editingItem, payload });
                showToast(editingItem ? "Utilisateur modifié" : "Utilisateur créé");
                setIsModalOpen(false);
                setEditingItem(null);
                await fetchCurrentView();
                return;
            }

            // standard entities
            const payload = {};
            const rawFiles = formData.getAll("files").filter((f) => f instanceof File && f.size > 0);

            for (let [key, value] of formData.entries()) {
                if (key === "files") continue;

                if (key.startsWith("relation_")) {
                    const realKey = key.replace("relation_", "");

                    if (value && value !== "") {
                        payload[realKey] = {
                            connect: [value],
                        };
                    }

                    continue;
                }

                if (typeof value === "string") {
                    if (key === "Price") payload[key] = parseFloat(value);
                    else if (key === "Stock") payload[key] = parseInt(value, 10);
                    else payload[key] = value;
                }
            }

            // minimal validation
            if (view === "categories" && !payload.marques) {
                showToast("Veuillez sélectionner une marque", "error");
                setIsSaving(false);
                return;
            }
            if (view === "pieces" && !payload.Category) {
                showToast("Veuillez sélectionner une catégorie", "error");
                setIsSaving(false);
                return;
            }

            await saveEntity({
                view,
                editingItem,
                payload,
                files: rawFiles,
            });

            showToast(editingItem ? "Modification réussie" : "Création réussie");
            setIsModalOpen(false);
            setEditingItem(null);
            await fetchCurrentView();
        } catch (e2) {
            console.error(e2);
            showToast(e2?.message || "Erreur de sauvegarde", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const onUpdateOrderStatus = async (order, newState) => {
        try {
            await updateOrderStatus({ order, newState });
            showToast(`Statut mis à jour : ${newState}`);
            await fetchDashboardStats();
            if (view === "orders") await fetchCurrentView();
            setSelectedOrder(null);
        } catch (e) {
            console.error(e);
            showToast("Erreur lors de la mise à jour", "error");
        }
    };

    const onArchive = async (order) => {
        const state = order?.state || "received";
        if (!["delivered", "cancelled", "rejected"].includes(state)) {
            showToast("Seules les commandes terminées peuvent être archivées.", "error");
            return;
        }
        if (!window.confirm("Voulez-vous vraiment archiver cette commande ?")) return;
        await onUpdateOrderStatus(order, "archived");
    };

    const headerTitle = useMemo(() => {
        if (view === "dashboard") return "Tableau de Bord";
        if (view === "orders") return "Gestion des Commandes";
        return `Gestion des ${view}`;
    }, [view]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>

                    <div className="flex flex-col items-center mb-8 relative z-10">
                        <div className="relative mb-4">
                            <Smartphone className="w-12 h-12 text-amber-500" />
                            <Settings className="w-6 h-6 text-white absolute -bottom-1 -right-1 animate-spin-slow" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-widest">
                            SAI <span className="text-amber-500">ADMIN</span>
                        </h1>
                        <p className="text-neutral-500 text-sm uppercase tracking-wide mt-2">Accès Sécurisé</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-amber-500 uppercase ml-1">Identifiant</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-black border border-neutral-700 text-white pl-12 pr-4 py-3 rounded-lg focus:border-amber-500 outline-none transition-colors"
                                    placeholder="Nom d'utilisateur"
                                    disabled={isLoggingIn}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-amber-500 uppercase ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black border border-neutral-700 text-white pl-12 pr-4 py-3 rounded-lg focus:border-amber-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                    disabled={isLoggingIn}
                                />
                            </div>
                        </div>

                        {loginError && (
                            <div className="flex items-center text-red-500 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoggingIn}
                            className={`w-full bg-amber-500 text-black font-bold py-4 rounded-lg transition uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center justify-center ${
                                isLoggingIn ? "opacity-70 cursor-not-allowed" : "hover:bg-amber-400"
                            }`}
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" /> Connexion...
                                </>
                            ) : (
                                "Connexion"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-neutral-800 pt-6">
                        <p className="text-neutral-600 text-xs">Accès réservé aux administrateurs.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminShell
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                view={view}
                setView={setView}
                onLogout={handleLogout}
            >
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-neutral-900 capitalize">{headerTitle}</h2>
                        <p className="text-neutral-500">Administration SAI Technologie</p>
                    </div>

                    {view !== "dashboard" && view !== "orders" && (
                        <Button
                            onClick={() => {
                                setEditingItem(null);
                                setIsModalOpen(true);
                            }}
                        >
                            <Plus className="w-5 h-5" /> Ajouter un élément
                        </Button>
                    )}
                </header>

                {view === "dashboard" && (
                    <DashboardView
                        stats={stats}
                        loadingStats={loadingStats}
                        statsRange={statsRange}
                        setStatsRange={setStatsRange}
                        boardOrders={boardOrders}
                        onSelectOrder={setSelectedOrder}
                        onUpdateOrderStatus={(order, state) => onUpdateOrderStatus(order, state)}
                        onArchive={onArchive}
                    />
                )}

                {view === "orders" && (
                    <OrdersView
                        loading={loading}
                        orders={orders}
                        onSelectOrder={setSelectedOrder}
                    />
                )}

                {view === "users" && (
                    <UsersView
                        loading={loading}
                        users={data}
                        onEdit={(u) => {
                            setEditingItem(u);
                            setIsModalOpen(true);
                        }}
                        onDelete={onDeleteRequest}
                    />
                )}

                {["marques", "categories", "pieces"].includes(view) && (
                    <EntitiesView
                        loading={loading}
                        view={view}
                        items={data}
                        onEdit={(item) => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                        }}
                        onDelete={onDeleteRequest}
                    />
                )}

                <EntityModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    editingItem={editingItem}
                    view={view}
                    relationMarques={relationMarques}
                    relationCategories={relationCategories}
                    relationUserRoles={relationUserRoles}
                    isSaving={isSaving}
                />

                <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />

                <DeleteConfirmationModal
                    isOpen={!!deleteId}
                    onClose={() => setDeleteId(null)}
                    onConfirm={confirmDelete}
                />
            </AdminShell>

            <Toast notification={notification} />
        </>
    );
}
