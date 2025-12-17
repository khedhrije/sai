import { Calendar, User, Box, X } from "lucide-react";

export default function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-neutral-800">Détails de la commande</h3>
                        <p className="text-xs text-neutral-500 font-mono">#{order.documentId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-neutral-100 text-neutral-700">
                {order.state || "received"}
              </span>
                            <span className="text-sm text-neutral-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />{" "}
                                {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
              </span>
                        </div>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 mb-6">
                        <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                            <User className="w-3 h-3" /> Informations Client
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-neutral-400">Nom d'utilisateur</p>
                                <p className="font-bold text-neutral-800">{order.user?.username || "Inconnu"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-400">Email</p>
                                <p className="font-bold text-neutral-800">{order.user?.email || "-"}</p>
                            </div>
                        </div>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-500 uppercase mb-3 flex items-center gap-2">
                        <Box className="w-3 h-3" /> Articles ({order.pieces?.length || 0})
                    </h4>

                    <div className="border rounded-lg overflow-hidden mb-6">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-neutral-50 text-neutral-500">
                            <tr>
                                <th className="p-3 font-medium">Article</th>
                                <th className="p-3 font-medium text-right">Prix Unit.</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                            {(order.pieces || []).map((piece, i) => (
                                <tr key={i}>
                                    <td className="p-3">
                                        <div className="font-bold text-neutral-700">{piece.Name}</div>
                                        <div className="text-xs text-neutral-400">
                                            Réf: {String(piece.documentId || "").slice(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="p-3 text-right font-mono text-neutral-600">
                                        {(piece.Price || 0).toFixed(3)} DT
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end items-center border-t pt-4">
                        <div className="text-right">
                            <p className="text-sm text-neutral-500 mb-1">Montant Total</p>
                            <p className="text-3xl font-black text-amber-600">
                                {(order.amount || 0).toFixed(3)} <span className="text-lg text-neutral-400">DT</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
