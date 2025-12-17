import React from "react";
import { Wrench } from "lucide-react";

const TypeFilter = ({ availableTypes, selectedType, onSelectType }) => {
    return (
        <div className="flex flex-wrap gap-2 items-center bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
      <span className="flex items-center text-sm font-bold text-neutral-400 mr-4 uppercase tracking-widest">
        <Wrench className="w-4 h-4 mr-2" /> TYPE :
      </span>

            {availableTypes.map((type) => (
                <button
                    key={type}
                    onClick={() => onSelectType(type)}
                    className={`px-4 py-2 rounded-full font-bold text-xs transition uppercase tracking-wide ${
                        selectedType === type ? "bg-amber-500 text-black shadow-md" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
    );
};

export default TypeFilter;
