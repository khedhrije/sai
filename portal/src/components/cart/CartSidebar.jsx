import React from "react";
import { X, Package, ShoppingCart, Loader, Send } from "lucide-react";

const CartSidebar = ({ isOpen, cart, cartTotal, isSubmitting, onClose, onPlaceOrder }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-neutral-900 h-full shadow-2xl p-6 flex flex-col border-l border-neutral-800 text-white animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
                    <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                        <Package className="w-6 h-6" /> Bon de Commande
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6 text-neutral-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4">
                            <ShoppingCart className="w-16 h-16 opacity-20" />
                            <p>Votre bon de commande est vide.</p>
                            <button onClick={onClose} className="text-amber-500 underline text-sm">
                                Retourner au catalogue
                            </button>
                        </div>
                    ) : (
                        cart.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 border-b border-neutral-800 pb-4 last:border-0">
                                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded bg-white" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-neutral-200">{item.name}</h4>
                                    <p className="text-xs text-neutral-500 mb-1">{item.brand}</p>
                                    <p className="text-amber-500 font-bold">{item.price.toFixed(3)} DT HT</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-neutral-800 pt-6 mt-4">
                        <div className="flex justify-between text-lg font-bold mb-6">
                            <span>Total Estimé (HT)</span>
                            <span className="text-amber-500">{cartTotal} DT</span>
                        </div>

                        <div className="bg-neutral-800 p-4 rounded mb-4 text-xs text-neutral-400 border border-neutral-700">
                            <p className="mb-1">
                                <span className="font-bold text-white">Note :</span> En cliquant ci-dessous, cette liste sera envoyée instantanément sur le Slack du magasinier pour préparation.
                            </p>
                        </div>

                        <button
                            onClick={onPlaceOrder}
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded font-bold uppercase tracking-wide flex items-center justify-center gap-3 transition ${
                                isSubmitting ? "bg-neutral-700 text-neutral-400 cursor-not-allowed" : "bg-amber-500 text-black hover:bg-amber-400"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" /> Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" /> Envoyer la commande
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
