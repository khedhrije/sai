import { useMemo } from "react";
import { ShoppingCart, DollarSign, Box, Users, Mail, Check, Loader, Package, Truck, Ban, XCircle, Archive } from "lucide-react";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import { cxColor } from "../utils/colors";

export default function DashboardView({
                                          stats,
                                          loadingStats,
                                          statsRange,
                                          setStatsRange,
                                          boardOrders,
                                          onSelectOrder,
                                          onUpdateOrderStatus,
                                          onArchive,
                                      }) {
    const steps = useMemo(
        () => [
            { title: "Reçue", status: "received", color: "blue", icon: Mail },
            { title: "Acceptée", status: "accepted", color: "indigo", icon: Check },
            { title: "En préparation", status: "preparation", color: "amber", icon: Loader },
            { title: "Prête", status: "ready_for_delivery", color: "purple", icon: Package },
            { title: "Livrée", status: "delivered", color: "green", icon: Truck },
            { title: "Rejetée", status: "rejected", color: "red", icon: Ban },
            { title: "Annulée", status: "cancelled", color: "gray", icon: XCircle },
        ],
        []
    );

    const getOrdersForStep = (stepStatus) =>
        (boardOrders || []).filter((o) => {
            const state = o.state || "received";
            if (state === "archived") return false;
            return state === stepStatus;
        });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-neutral-800">Vue d'ensemble</h2>
                    <p className="text-neutral-500">Performances sur la période sélectionnée.</p>
                </div>

                <div className="bg-white rounded-lg p-1 shadow-sm border border-neutral-200 inline-flex">
                    {[
                        { id: "day", label: "Jour" },
                        { id: "week", label: "Semaine" },
                        { id: "month", label: "Mois" },
                        { id: "year", label: "Année" },
                    ].map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setStatsRange(p.id)}
                            className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                                statsRange === p.id ? "bg-black text-amber-500 shadow-sm" : "text-neutral-500 hover:text-black hover:bg-neutral-50"
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Commandes" value={stats.orders} subtitle="sur la période" icon={ShoppingCart} color="amber" loading={loadingStats} />
                <StatCard title="Chiffre d'Affaires" value={`${Number(stats.revenue || 0).toFixed(3)} DT`} subtitle="sur la période" icon={DollarSign} color="green" loading={loadingStats} />
                <StatCard title="Catalogue Global" value={stats.stock} subtitle="Total références" icon={Box} color="blue" loading={loadingStats} />
                <StatCard title="Nouveaux Clients" value={stats.users} subtitle="Inscrits sur la période" icon={Users} color="purple" loading={loadingStats} />
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-bold text-neutral-800 mb-6">Suivi des Commandes (Board)</h3>

                <div className="flex gap-4 mt-4 h-[650px] overflow-x-auto pb-4 custom-scrollbar">
                    {steps.map((step) => {
                        const StepIcon = step.icon;
                        const c = cxColor(step.color);
                        const list = getOrdersForStep(step.status);

                        return (
                            <div key={step.status} className="bg-neutral-50 rounded-xl p-4 flex flex-col h-full min-w-[300px] w-[300px] flex-shrink-0">
                                <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${c.border200}`}>
                                    <div className="flex items-center gap-2">
                                        <StepIcon className={`w-4 h-4 ${c.text600}`} />
                                        <h4 className="font-bold text-neutral-700 uppercase text-xs tracking-wider">{step.title}</h4>
                                    </div>
                                    <span className={`${c.bg100} ${c.text700} text-xs px-2 py-1 rounded-full font-bold`}>{list.length}</span>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                                    {list.map((order) => {
                                        const user = order.user || { username: "Anonyme" };
                                        const amount = order.amount || 0;
                                        const state = order.state || "received";
                                        const id = order.documentId;

                                        return (
                                            <div
                                                key={id}
                                                onClick={() => onSelectOrder(order)}
                                                className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 hover:shadow-md transition-shadow group cursor-pointer relative"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-mono text-xs text-neutral-400">#{String(id).slice(0, 6)}...</span>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onArchive(order);
                                                        }}
                                                        className="text-neutral-400 hover:text-amber-500 transition-colors p-1"
                                                        title="Archiver (si terminé)"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="font-bold text-neutral-800 text-sm mb-1">{user.username}</div>
                                                <div className="text-amber-600 font-bold text-sm mb-3">{Number(amount).toFixed(3)} DT</div>

                                                <div className="flex flex-col gap-2">
                                                    {state === "received" && (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onUpdateOrderStatus(order, "accepted");
                                                                }}
                                                                variant="success"
                                                                className="flex-1 text-xs py-1 h-8"
                                                            >
                                                                Accepter
                                                            </Button>
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    onUpdateOrderStatus(order, "rejected");
                                                                }}
                                                                variant="danger"
                                                                className="flex-1 text-xs py-1 h-8"
                                                            >
                                                                Rejeter
                                                            </Button>
                                                        </div>
                                                    )}

                                                    {state === "accepted" && (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onUpdateOrderStatus(order, "preparation");
                                                            }}
                                                            variant="primary"
                                                            className="w-full text-xs py-1 h-8"
                                                        >
                                                            Lancer Préparation
                                                        </Button>
                                                    )}

                                                    {state === "preparation" && (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onUpdateOrderStatus(order, "ready_for_delivery");
                                                            }}
                                                            variant="primary"
                                                            className="w-full text-xs py-1 h-8"
                                                        >
                                                            Prête à livrer
                                                        </Button>
                                                    )}

                                                    {state === "ready_for_delivery" && (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onUpdateOrderStatus(order, "delivered");
                                                            }}
                                                            variant="success"
                                                            className="w-full text-xs py-1 h-8"
                                                        >
                                                            Confirmer Livraison
                                                        </Button>
                                                    )}

                                                    {["received", "accepted", "preparation", "ready_for_delivery"].includes(state) && (
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onUpdateOrderStatus(order, "cancelled");
                                                            }}
                                                            variant="outline"
                                                            className="w-full text-xs py-1 h-8 text-red-500 border-red-200 hover:bg-red-50"
                                                        >
                                                            Annuler
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {list.length === 0 && <div className="text-center py-10 text-neutral-400 text-xs italic">Vide</div>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
