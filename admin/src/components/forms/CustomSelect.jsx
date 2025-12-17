import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
                                         label,
                                         name,
                                         options,
                                         defaultValue,
                                         placeholder,
                                         onChange,
                                         required = false,
                                     }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(defaultValue || "");
    const ref = useRef(null);

    const selectedOption = (options || []).find((opt) => {
        const optId = opt.documentId || opt.id;
        return String(optId) === String(selectedId);
    });

    useEffect(() => {
        const onDoc = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", onDoc);
        return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    useEffect(() => setSelectedId(defaultValue || ""), [defaultValue]);

    const pick = (id) => {
        setSelectedId(id);
        setIsOpen(false);
        onChange?.(id);
    };

    return (
        <div className="relative" ref={ref}>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input type="hidden" name={name} value={selectedId} required={required} />
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                className={`w-full border rounded p-2 outline-none bg-white text-left flex justify-between items-center transition-colors ${
                    isOpen ? "border-amber-500 ring-1 ring-amber-500" : "border-neutral-300"
                } ${required && !selectedId ? "border-l-4 border-l-red-500" : ""}`}
            >
        <span className={`block truncate ${selectedOption ? "text-neutral-900" : "text-neutral-400"}`}>
          {selectedOption ? (selectedOption.Name || selectedOption.name || selectedOption.attributes?.Name) : placeholder}
        </span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-150">
                    {(options || []).length > 0 ? (
                        (options || []).map((opt) => {
                            const optId = opt.documentId || opt.id;
                            return (
                                <div
                                    key={optId}
                                    onClick={() => pick(optId)}
                                    className={`p-3 text-sm cursor-pointer hover:bg-neutral-50 flex justify-between items-center transition-colors ${
                                        String(selectedId) === String(optId)
                                            ? "bg-amber-50 text-amber-700 font-medium"
                                            : "text-neutral-700"
                                    }`}
                                >
                                    <span className="truncate">{opt.Name || opt.name || opt.attributes?.Name}</span>
                                    {String(selectedId) === String(optId) && <Check className="w-4 h-4 text-amber-500" />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-4 text-sm text-neutral-400 text-center italic">Aucune option disponible</div>
                    )}
                </div>
            )}
        </div>
    );
}
