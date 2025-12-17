import { Loader, Image as ImageIcon, Edit, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";
import { pickFirstMediaUrl } from "../utils/media";

export default function EntitiesView({ loading, view, items, onEdit, onDelete }) {
    if (loading) return <div className="flex justify-center p-20"><Loader className="animate-spin w-10 h-10 text-amber-500" /></div>;

    const isPieces = view === "pieces";

    return (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase">
                <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Description</th>
                    {isPieces && <th className="p-4">Prix</th>}
                    {isPieces && <th className="p-4">Stock</th>}
                    {isPieces && <th className="p-4">Marque</th>}
                    {isPieces && <th className="p-4">Catégorie</th>}
                    <th className="p-4 text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                {(items || []).map((item) => {
                    const id = item.documentId || item.id;
                    const imgUrl = pickFirstMediaUrl(item);

                    const marque =
                        item.marque ||
                        item.Marque ||
                        item.attributes?.marque?.data?.attributes ||
                        item.attributes?.Marque?.data?.attributes;

                    const category =
                        item.category ||
                        item.Category ||
                        item.attributes?.category?.data?.attributes ||
                        item.attributes?.Category?.data?.attributes;

                    const name = item.Name || item.attributes?.Name;
                    const desc = item.Description || item.attributes?.Description || "-";

                    return (
                        <tr key={id} className="hover:bg-neutral-50 group">
                            <td className="p-4">
                                {imgUrl ? (
                                    <img src={imgUrl} alt="" className="w-10 h-10 object-cover rounded bg-neutral-100" />
                                ) : (
                                    <div className="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center text-neutral-300">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                )}
                            </td>

                            <td className="p-4 font-bold text-neutral-800">{name}</td>
                            <td className="p-4 text-neutral-500 truncate max-w-xs">{desc}</td>

                            {isPieces && (
                                <>
                                    <td className="p-4 font-mono text-amber-600 font-bold">
                                        {Number(item.Price || item.attributes?.Price || 0).toFixed(3)} DT
                                    </td>
                                    <td className="p-4 font-mono font-bold">{item.Stock || item.attributes?.Stock || 0}</td>
                                    <td className="p-4 text-xs text-neutral-600">{marque?.Name || "-"}</td>
                                    <td className="p-4 text-xs text-neutral-600">{category?.Name || "-"}</td>
                                </>
                            )}

                            <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" onClick={() => onEdit(item)} className="py-1 px-2">
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="danger" onClick={() => onDelete(id)} className="py-1 px-2">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    );
                })}

                {(items || []).length === 0 && (
                    <tr>
                        <td colSpan={isPieces ? 8 : 4} className="p-8 text-center text-neutral-400">
                            Aucune donnée trouvée.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
