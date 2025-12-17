import { Loader } from "lucide-react";

export default function OrdersView({ loading, orders, onSelectOrder }) {
    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin w-10 h-10 text-amber-500" /></div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase">
                <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Montant</th>
                    <th className="p-4">Détails</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                {(orders || []).map((o) => {
                    const user = o.user || { username: "Anonyme" };
                    const id = o.documentId;
                    const state = o.state || "received";
                    const amount = o.amount || 0;

                    return (
                        <tr key={id} className="hover:bg-neutral-50 cursor-pointer" onClick={() => onSelectOrder(o)}>
                            <td className="p-4 font-mono text-xs">#{String(id).slice(0, 6)}...</td>
                            <td className="p-4">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
                            <td className="p-4"><span className="bg-neutral-100 px-2 py-1 rounded text-xs font-bold uppercase">{state}</span></td>
                            <td className="p-4 font-bold">{user.username}</td>
                            <td className="p-4 font-bold text-green-600">{Number(amount).toFixed(3)} DT</td>
                            <td className="p-4 text-xs text-neutral-500">{(o.pieces || []).map((p) => p.Name).join(", ")}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {(orders || []).length === 0 && <div className="p-10 text-center text-neutral-400">Aucune donnée.</div>}
        </div>
    );
}
