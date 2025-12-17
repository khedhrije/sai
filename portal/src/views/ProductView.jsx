import React from "react";
import { ArrowLeft, ChevronRight, Check, Minus, Plus, Settings, ShoppingCart } from "lucide-react";
import { getStockStatus, stockPanelClass } from "../utils/stock";

const ProductView = ({
                         product,
                         activeImage,
                         setActiveImage,
                         quantity,
                         setQuantity,
                         isAdding,
                         onAddToCart,
                         onBack,
                         onCrumbBrand,
                         onCrumbType,
                     }) => {
    if (!product) return null;

    const status = getStockStatus(product.stock);
    const StatusIcon = status.icon;

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Breadcrumb */}
            <div className="bg-neutral-100 border-b border-neutral-200 py-3">
                <div className="container mx-auto px-4 text-xs font-bold text-neutral-500 uppercase tracking-wide flex items-center">
                    <span onClick={onBack} className="cursor-pointer hover:text-black">Accueil</span>
                    <ChevronRight className="w-3 h-3 mx-2" />
                    <span onClick={onCrumbBrand} className="cursor-pointer hover:text-black">{product.brand}</span>
                    <ChevronRight className="w-3 h-3 mx-2" />
                    <span onClick={onCrumbType} className="cursor-pointer hover:text-black">{product.type}</span>
                    <ChevronRight className="w-3 h-3 mx-2" />
                    <span className="text-amber-600">{product.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <button onClick={onBack} className="flex items-center text-sm font-bold text-neutral-500 hover:text-black mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Retour au catalogue
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Gallery */}
                    <div className="lg:w-5/12">
                        <div className="sticky top-24">
                            <div className="border border-neutral-200 rounded-lg p-8 flex items-center justify-center bg-white relative overflow-hidden group">
                                <img
                                    src={activeImage}
                                    alt={product.name}
                                    className="w-full max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">SAI CERTIFIED</span>
                                </div>
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(img)}
                                            className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden ${
                                                activeImage === img ? "border-amber-500" : "border-transparent hover:border-neutral-300"
                                            }`}
                                        >
                                            <img src={img} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="lg:w-4/12">
                        <div className="border-b border-neutral-200 pb-4 mb-4">
                            <h1 className="text-3xl font-black text-neutral-900 mb-2 leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-neutral-500">
                  Compatibilité : <span className="text-black font-bold">{product.brand}</span>
                </span>
                            </div>
                        </div>

                        <div className="mb-6 bg-neutral-50 p-4 rounded border border-neutral-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-neutral-900">{product.price.toFixed(3)} DT</span>
                                <span className="text-sm text-neutral-500">HT / pièce</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    <Settings className="w-5 h-5 text-neutral-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase">Type</h4>
                                    <p className="text-sm text-neutral-600">{product.type} - Qualité Pro</p>
                                </div>
                            </div>

                            <div className="prose prose-sm text-neutral-600">
                                <h4 className="font-bold text-neutral-900 uppercase">Description Technique</h4>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order box */}
                    <div className="lg:w-3/12">
                        <div className="border border-neutral-200 rounded-lg p-6 shadow-lg bg-white sticky top-24">
                            <div className={`mb-6 flex items-center p-3 rounded border ${stockPanelClass[status.color]}`}>
                                <StatusIcon className="w-5 h-5 mr-2" />
                                <div>
                                    <div className="font-bold text-sm">
                                        {product.stock === 0 ? "Rupture de stock" : product.stock <= 5 ? "Bientôt en rupture !" : "Disponible en stock"}
                                    </div>
                                    <div className="text-xs">
                                        {product.stock === 0 ? "Réapprovisionnement en cours" : product.stock <= 5 ? "Dernières pièces disponibles" : "Stock confortable"}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Quantité à commander (Max 5) :</label>

                                <div className={`flex items-center border border-neutral-300 rounded-md overflow-hidden w-full ${product.stock <= 0 ? "opacity-50 pointer-events-none" : ""}`}>
                                    <button
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-3 hover:bg-neutral-100 text-neutral-600 transition border-r border-neutral-300 bg-neutral-50 flex-shrink-0"
                                        disabled={product.stock <= 0}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>

                                    <input
                                        type="number"
                                        min="1"
                                        max={Math.min(5, product.stock)}
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Math.min(Math.min(5, product.stock), Math.max(1, parseInt(e.target.value) || 1)))
                                        }
                                        className="flex-1 bg-white text-center text-neutral-900 font-bold outline-none h-full py-3 min-w-0"
                                        disabled={product.stock <= 0}
                                    />

                                    <button
                                        onClick={() => setQuantity((q) => Math.min(Math.min(5, product.stock), q + 1))}
                                        className={`p-3 transition border-l border-neutral-300 flex-shrink-0 ${
                                            quantity >= Math.min(5, product.stock)
                                                ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                                                : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600"
                                        }`}
                                        disabled={quantity >= Math.min(5, product.stock) || product.stock <= 0}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={onAddToCart}
                                disabled={isAdding || product.stock <= 0}
                                className={`w-full font-bold py-4 rounded transition-all duration-200 shadow-sm uppercase tracking-wide flex items-center justify-center gap-2 transform ${
                                    isAdding
                                        ? "bg-green-600 text-white scale-95"
                                        : product.stock > 0
                                            ? "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-md hover:-translate-y-1 active:scale-95"
                                            : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                }`}
                            >
                                {isAdding ? (
                                    <>
                                        <Check className="w-6 h-6" /> Ajouté avec succès
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5" /> {product.stock > 0 ? "Ajouter au bon" : "Indisponible"}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-neutral-400 text-center mt-4">
                                Cet article sera ajouté à votre liste de commande en cours. Aucune facturation immédiate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
