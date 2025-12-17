import { X, AlertTriangle, Check } from "lucide-react";

export const stockBadgeClass = {
    red: "bg-red-100 text-red-800 border-red-200",
    orange: "bg-orange-100 text-orange-800 border-orange-200",
    green: "bg-green-100 text-green-800 border-green-200",
};

export const stockPanelClass = {
    red: "bg-red-50 text-red-700 border-red-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    green: "bg-green-50 text-green-700 border-green-100",
};

export const getStockStatus = (stock) => {
    if (stock <= 0) return { label: "RUPTURE", color: "red", icon: X };
    if (stock <= 5) return { label: `PLUS QUE ${stock} !`, color: "orange", icon: AlertTriangle };
    return { label: "EN STOCK", color: "green", icon: Check };
};
