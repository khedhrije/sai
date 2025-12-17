import React from "react";
import { ArrowLeft, Calendar, ClipboardList, Loader, XCircle } from "lucide-react";

const OrdersView = ({ orders, isLoadingOrders, onRefresh, onCancel, onBack }) => {
    return (
        <div className="min-h-screen bg-neutral-100 pb-20">
            <div className="bg-black shadow-md border-b border-neutral-800 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <button onClick={onBack} className="text-neutral-400 hover:text-white font-bold text-sm flex items-center">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour au Catalogue
                    </button>
                    <div className="text-white font-black text-lg tracking-wider">HISTORIQUE</div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">Mes Commandes</h1>
                        <p className="text-neutral-500 mt-1">Suivi de vos demandes en temps réel</p>
                    </div>
                    <button onClick={onRefresh} className="bg-black text-white px-4 py-2 rounded font-bold text-sm hover:bg-neutral-800 flex items-center gap-2 transition">
                        <Loader className={`w-4 h-4 ${isLoadingOrders ? "animate-spin" : ""}`} /> Actualiser
                    </button>
                </div>

                {isLoadingOrders ? (
                    <div className="flex justify-center py-20">
                        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-12 rounded-lg text-center shadow-sm">
                        <ClipboardList className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-neutral-700">Aucune commande trouvée</h3>
                        <p className="text-neutral-500">Vos futures commandes apparaîtront ici.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {orders.map((order) => {
                            const pieces = order.pieces || order.attributes?.pieces?.data || [];
                            const amount = order.amount || order.attributes?.amount || 0;
                            const date = new Date(order.createdAt || order.attributes?.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            const state = order.state || order.attributes?.state || "received";
                            const isCancellable = !["delivered", "cancelled", "rejected"].includes(state);

                            return (
                                <div key={order.id || order.documentId} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow group relative">
                                    <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-sm font-bold text-neutral-600">
                                            <Calendar className="w-4 h-4 text-amber-500" /> {date}
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                state === "cancelled" || state === "rejected"
                                                    ? "bg-red-100 text-red-600"
                                                    : state === "delivered"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                      {state || "reçue"}
                    </span>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-6">
                                            <p className="text-xs text-neutral-400 uppercase font-bold mb-2">Articles commandés ({pieces.length})</p>
                                            <div className="bg-neutral-50 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2 custom-scrollbar">
                                                {pieces.length > 0 ? (
                                                    pieces.map((piece, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm border-b border-neutral-100 pb-1 last:border-0 last:pb-0">
                                                            <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                                                            <span className="truncate flex-1 text-neutral-700">{piece.Name || piece.attributes?.Name || "Pièce inconnue"}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-neutral-400 italic">Détails indisponibles</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                                            <span className="text-sm font-bold text-neutral-500 uppercase">Montant</span>
                                            <span className="text-2xl font-black text-black">
                        {Number(amount).toFixed(3)} <span className="text-sm text-amber-600">DT</span>
                      </span>
                                        </div>

                                        {isCancellable && (
                                            <button
                                                onClick={() => onCancel(order.documentId || order.id)}
                                                className="mt-4 w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg text-xs font-bold border border-transparent hover:border-red-100 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" /> Annuler la commande
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersView;
