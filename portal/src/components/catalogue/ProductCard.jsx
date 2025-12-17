import React from "react";
import { ShoppingCart } from "lucide-react";
import { getStockStatus, stockBadgeClass } from "../../utils/stock";

const ProductCard = ({ product, onOpen, onAdd }) => {
    const status = getStockStatus(product.stock);
    const StatusIcon = status.icon;

    return (
        <div
            onClick={() => onOpen(product)}
            className="bg-white rounded-lg shadow-sm hover:shadow-2xl transition duration-300 group border border-transparent hover:border-amber-500/30 flex flex-col cursor-pointer"
        >
            <div className="relative h-64 bg-neutral-50 rounded-t-lg overflow-hidden p-6 flex items-center justify-center">
                <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-500 mix-blend-multiply"
                />
                <div
                    className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold rounded flex items-center border ${
                        stockBadgeClass[status.color]
                    } ${status.color === "orange" ? "animate-pulse" : ""}`}
                >
                    <StatusIcon className="w-3 h-3 mr-1" /> {status.label}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-1 rounded font-bold uppercase tracking-wider">
            {product.brand}
          </span>
                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">{product.type}</span>
                </div>

                <h3 className="font-bold text-lg text-black mb-1 leading-snug group-hover:text-amber-600 transition-colors">
                    {product.name}
                </h3>

                <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between">
          <span className="text-2xl font-black text-black">
            {product.price.toFixed(0)}
              <span className="text-sm align-top text-neutral-500">,{(product.price % 1).toFixed(3).substring(2)} DT</span>
          </span>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (product.stock > 0) onAdd(product);
                        }}
                        className={`p-3 rounded transition-colors group-hover:text-white ${
                            product.stock > 0
                                ? "bg-neutral-100 text-black hover:bg-amber-500 hover:text-black group-hover:bg-black group-hover:hover:bg-amber-500 group-hover:hover:text-black"
                                : "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                        }`}
                        title={product.stock > 0 ? "Ajouter au bon de commande" : "Rupture de stock"}
                        disabled={product.stock <= 0}
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
