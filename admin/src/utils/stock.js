import { AlertTriangle, Check, X } from "lucide-react";

export function getStockStatus(stock) {
    if (stock <= 0) return { label: "RUPTURE", color: "red", icon: X };
    if (stock <= 5) return { label: `PLUS QUE ${stock} !`, color: "amber", icon: AlertTriangle };
    return { label: "EN STOCK", color: "green", icon: Check };
}
