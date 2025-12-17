import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, onOpenProduct, onAddToCart, onResetFilters }) => {
    if (products.length === 0) {
        return (
            <div className="col-span-full py-20 text-center">
                <p className="text-xl text-neutral-400 font-medium">Aucune pièce ne correspond à ces critères.</p>
                <button onClick={onResetFilters} className="mt-4 text-amber-500 font-bold underline">
                    Réinitialiser les filtres
                </button>
            </div>
        );
    }

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onOpen={onOpenProduct} onAdd={onAddToCart} />
            ))}
        </>
    );
};

export default ProductGrid;
