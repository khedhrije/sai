import React, { useRef } from "react";
import { Search, ShieldCheck, Truck, Star, Phone } from "lucide-react";
import { useOutsideClick } from "../hooks/useOutsideClick";

import BrandFilter from "../components/catalogue/BrandFilter";
import TypeFilter from "../components/catalogue/TypeFilter";
import ProductGrid from "../components/catalogue/ProductGrid";

const HomeView = ({
                      // Search
                      searchTerm,
                      setSearchTerm,
                      showSuggestions,
                      setShowSuggestions,
                      suggestions,
                      onPickSuggestion,
                      onScrollCatalogue,

                      // Filters + Catalogue
                      brands,
                      selectedBrand,
                      onSelectBrand,
                      availableTypes,
                      selectedType,
                      onSelectType,
                      filteredProducts,
                      onOpenProduct,
                      onAddToCart,
                      onResetFilters,
                  }) => {
    const searchRef = useRef(null);
    useOutsideClick(searchRef, () => setShowSuggestions(false));

    return (
        <>
            {/* HERO */}
            <header id="home" className="relative bg-black text-white min-h-[85vh] flex flex-col justify-center items-center z-10">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center grayscale"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-neutral-50"></div>

                <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center w-full max-w-4xl">
                    <div className="inline-flex items-center gap-2 border border-amber-500/50 bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                        <Star className="w-3 h-3 fill-amber-500" />
                        Portail de Commande Réservé aux Clients
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
                        CONSULTEZ <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">LE STOCK & LES PRIX</span>
                    </h1>

                    <p className="text-xl text-neutral-400 mb-12 max-w-2xl font-light">
                        Portail SAI Technologie. Vérifiez la disponibilité en temps réel et passez vos commandes de réapprovisionnement directement auprès du magasinier.
                    </p>

                    {/* Search */}
                    <div ref={searchRef} className="w-full max-w-2xl relative group z-30">
                        <div className="relative flex items-center transform transition-transform duration-300 group-hover:scale-[1.01]">
                            <div className="absolute inset-0 bg-amber-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative w-full bg-neutral-900 border-2 border-neutral-700 group-hover:border-amber-500 rounded-lg shadow-2xl flex items-center overflow-hidden transition-colors">
                                <Search className="w-6 h-6 text-neutral-500 ml-5" />
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Rechercher une référence (ex: iPhone 14, Écran...)"
                                    className="w-full px-5 py-5 outline-none text-lg text-white placeholder:text-neutral-500 bg-transparent font-medium"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            onScrollCatalogue();
                                            setShowSuggestions(false);
                                        }
                                    }}
                                />
                                <button
                                    onClick={onScrollCatalogue}
                                    className="bg-amber-500 text-black px-8 py-5 font-bold hover:bg-amber-400 transition h-full uppercase tracking-wider text-sm hidden sm:block"
                                >
                                    Vérifier
                                </button>
                            </div>
                        </div>

                        {/* Suggestions */}
                        {showSuggestions && searchTerm.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden z-50">
                                {suggestions.length > 0 ? (
                                    suggestions.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => onPickSuggestion(product)}
                                            className="p-4 hover:bg-neutral-800 cursor-pointer flex items-center transition border-b border-neutral-800 last:border-0 group"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-12 h-12 rounded bg-white object-cover mr-4 opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="flex-1 text-left">
                                                <p className="text-base font-bold text-white group-hover:text-amber-500 transition-colors">{product.name}</p>
                                                <p className="text-xs text-neutral-500 uppercase">
                                                    {product.brand} • {product.type}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-amber-500">{product.price.toFixed(3)} DT</p>
                                                {product.stock > 0 ? (
                                                    <p className="text-[10px] text-green-500 font-medium">EN STOCK</p>
                                                ) : (
                                                    <p className="text-[10px] text-red-500 font-medium">RUPTURE</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-neutral-500">Aucun résultat pour "{searchTerm}"</div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-12 flex gap-6 text-sm font-semibold text-neutral-500">
                        <div className="flex items-center">
                            <ShieldCheck className="w-4 h-4 text-amber-500 mr-2" /> Stock Réel
                        </div>
                        <div className="flex items-center">
                            <Truck className="w-4 h-4 text-amber-500 mr-2" /> Retrait Immédiat
                        </div>
                    </div>
                </div>
            </header>

            {/* CATALOGUE */}
            <section id="catalogue" className="py-24 bg-neutral-100">
                <div className="container mx-auto px-4">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-black mb-4 flex items-center">
                            CATALOGUE <span className="text-amber-500 text-6xl leading-none ml-2">.</span>
                        </h2>
                        <p className="text-neutral-500 font-medium mb-8">Vérifiez la disponibilité des pièces et ajoutez-les à votre commande.</p>

                        <BrandFilter
                            brands={brands}
                            selectedBrand={selectedBrand}
                            onSelectBrand={(brand) => {
                                onSelectBrand(brand);
                            }}
                        />

                        <TypeFilter availableTypes={availableTypes} selectedType={selectedType} onSelectType={onSelectType} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ProductGrid
                            products={filteredProducts}
                            onOpenProduct={onOpenProduct}
                            onAddToCart={onAddToCart}
                            onResetFilters={onResetFilters}
                        />
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="py-24 bg-black text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-amber-500/10 skew-x-12 transform translate-x-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl font-black uppercase mb-4 text-amber-500">Besoin d'aide ?</h2>
                        <p className="text-neutral-400 mb-8">
                            En cas de doute sur une référence ou pour une commande spéciale hors catalogue, contactez directement l'entrepôt.
                        </p>
                        <div className="inline-flex items-center bg-neutral-900 border border-neutral-800 px-8 py-4 rounded-lg">
                            <Phone className="w-6 h-6 text-amber-500 mr-4" />
                            <span className="text-xl font-bold">+33 1 23 45 67 89 (Ligne Directe Magasin)</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeView;
