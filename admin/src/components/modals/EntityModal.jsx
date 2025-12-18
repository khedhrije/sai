import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader, Save, Upload, X } from "lucide-react";

const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const baseStyle =
        "px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm";
    const variants = {
        primary: "bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50",
        secondary: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
    };
    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const CustomSelect = ({
                          label,
                          name,
                          options,
                          defaultValue,
                          placeholder,
                          onChange,
                          required = false,
                          valueKey = "documentId", // ✅ NEW: "documentId" (default) or "id"
                      }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(defaultValue || "");
    const selectRef = useRef(null);

    const getOptId = (opt) => {
        if (valueKey === "id") return String(opt?.id ?? opt?.documentId ?? "");
        return String(opt?.documentId ?? opt?.id ?? "");
    };

    const getOptLabel = (opt) =>
        opt?.Name ||
        opt?.name ||
        opt?.attributes?.Name ||
        opt?.attributes?.name ||
        "";

    const selectedOption = options.find((opt) => getOptId(opt) === String(selectedId));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => setSelectedId(defaultValue || ""), [defaultValue]);

    const handleSelect = (id) => {
        setSelectedId(id);
        setIsOpen(false);
        onChange?.(id);
    };

    return (
        <div className="relative" ref={selectRef}>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <input type="hidden" name={name} value={selectedId} required={required} />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full border rounded p-2 outline-none bg-white text-left flex justify-between items-center transition-colors ${
                    isOpen ? "border-amber-500 ring-1 ring-amber-500" : "border-neutral-300"
                }`}
            >
        <span className={`block truncate ${selectedOption ? "text-neutral-900" : "text-neutral-400"}`}>
          {selectedOption ? selectedOption.Name || selectedOption.name : placeholder}
        </span>
                <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                    {options.length > 0 ? (
                        options.map((opt) => {
                            const optId = getOptId(opt);
                            return (
                                <div
                                    key={optId}
                                    onClick={() => handleSelect(optId)}
                                    className={`p-3 text-sm cursor-pointer hover:bg-neutral-50 flex justify-between items-center ${
                                        String(selectedId) === String(optId)
                                            ? "bg-amber-50 text-amber-700 font-medium"
                                            : "text-neutral-700"
                                    }`}
                                >
                                    <span className="truncate">{opt.Name || opt.name}</span>
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
};

export default function EntityModal({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        editingItem,
                                        view,
                                        relationMarques,
                                        relationCategories,
                                        relationUserRoles,
                                        isSaving,
                                    }) {
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        if (isOpen) setSelectedFiles([]);
    }, [isOpen]);

    if (!isOpen) return null;

    const defaults = editingItem ? editingItem.attributes || editingItem : {};

    // ✅ more robust for relation shapes (object / array / {data})
    const getRelationId = (relation) => {
        if (!relation) return "";

        // array of relations
        if (Array.isArray(relation)) {
            const first = relation[0];
            if (!first) return "";
            return first.documentId || first.id || "";
        }

        // Strapi relation wrapper
        if (relation.data) {
            if (Array.isArray(relation.data)) {
                const first = relation.data[0];
                if (!first) return "";
                return first.documentId || first.id || "";
            }
            return relation.data.documentId || relation.data.id || "";
        }

        return relation.documentId || relation.id || "";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex justify-between items-center flex-shrink-0">
                    <h3 className="font-bold text-lg capitalize">
                        {editingItem ? "Modifier" : "Ajouter"} {view.replace("s", "")}
                    </h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-neutral-400 hover:text-black" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 pb-40">
                    <form id="admin-form" onSubmit={onSubmit} className="space-y-4">
                        {view === "users" ? (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                                            Nom d'utilisateur
                                        </label>
                                        <input
                                            name="username"
                                            defaultValue={defaults.username}
                                            required
                                            className="w-full border border-neutral-300 rounded p-2 focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                                            Email
                                        </label>
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={defaults.email}
                                            required
                                            className="w-full border border-neutral-300 rounded p-2 focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {!editingItem && (
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                                            Mot de passe
                                        </label>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="w-full border border-neutral-300 rounded p-2 focus:border-amber-500 outline-none"
                                        />
                                    </div>
                                )}

                                <div>
                                    <CustomSelect
                                        label="Rôle Utilisateur (Business)"
                                        name="relation_user_role"
                                        options={relationUserRoles || []}
                                        valueKey="id" // ✅ MUST be numeric id for /api/users
                                        defaultValue={String(defaults?.user_role?.id || "")} // ✅ numeric id
                                        placeholder="Sélectionner un rôle..."
                                        required={true}
                                    />
                                </div>

                                <div className="flex items-center gap-6 mt-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="confirmed"
                                            defaultChecked={defaults.confirmed !== false}
                                            className="mr-2 accent-amber-500 w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-neutral-700">Confirmé</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="blocked"
                                            defaultChecked={defaults.blocked === true}
                                            className="mr-2 accent-red-500 w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-neutral-700">Bloqué</span>
                                    </label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                                        Nom (Name)
                                    </label>
                                    <input
                                        name="Name"
                                        defaultValue={defaults.Name}
                                        required
                                        className="w-full border border-neutral-300 rounded p-2 focus:border-amber-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="Description"
                                        defaultValue={defaults.Description}
                                        rows="3"
                                        className="w-full border border-neutral-300 rounded p-2 focus:border-amber-500 outline-none"
                                    />
                                </div>

                                {view === "categories" && (
                                    <div>
                                        <CustomSelect
                                            label="Marque Parente"
                                            name="relation_marques"
                                            options={relationMarques || []}
                                            defaultValue={getRelationId(defaults.marques)}
                                            placeholder="Associer à une marque..."
                                            required={true}
                                        />
                                    </div>
                                )}

                                {view === "pieces" && (
                                    <div>
                                        <CustomSelect
                                            label="Catégorie"
                                            name="relation_Category"
                                            options={relationCategories || []}
                                            defaultValue={getRelationId(defaults.category)}
                                            placeholder="Sélectionner..."
                                            required={true}
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
                                        {view === "pieces" ? "Photos (Multiple)" : "Logo"}
                                    </label>

                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition cursor-pointer relative ${
                                            selectedFiles.length > 0
                                                ? "border-amber-500 bg-amber-50"
                                                : "border-neutral-300 hover:border-amber-500 hover:bg-neutral-50"
                                        }`}
                                    >
                                        {selectedFiles.length > 0 ? (
                                            <>
                                                <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                                    <Check className="w-6 h-6 text-amber-500" />
                                                </div>
                                                <span className="text-sm font-bold text-neutral-700 truncate max-w-full px-4">
                          {selectedFiles.length} fichier(s) sélectionné(s)
                        </span>
                                                <span className="text-xs text-neutral-500 mt-2">Cliquez pour changer</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 mb-2 text-neutral-400" />
                                                <span className="text-xs text-neutral-500">Cliquez pour upload</span>
                                            </>
                                        )}

                                        <input
                                            type="file"
                                            name="files"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            multiple={view === "pieces"}
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0)
                                                    setSelectedFiles(Array.from(e.target.files));
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex justify-end gap-3 flex-shrink-0">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button type="submit" form="admin-form" disabled={isSaving}>
                        {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{" "}
                        {isSaving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
