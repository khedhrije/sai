import React from "react";
import { Filter } from "lucide-react";

const BrandFilter = ({ brands, selectedBrand, onSelectBrand }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
      <span className="flex items-center text-sm font-bold text-neutral-400 mr-4 uppercase tracking-widest">
        <Filter className="w-4 h-4 mr-2" /> MARQUE :
      </span>

            {brands.map((brand) => (
                <button
                    key={brand}
                    onClick={() => onSelectBrand(brand)}
                    className={`px-6 py-3 rounded font-bold text-sm transition uppercase tracking-wide border-2 ${
                        selectedBrand === brand
                            ? "bg-black text-amber-500 border-black shadow-lg"
                            : "bg-white text-neutral-600 border-transparent hover:border-neutral-300"
                    }`}
                >
                    {brand}
                </button>
            ))}
        </div>
    );
};

export default BrandFilter;
