import React from "react";
import { Smartphone } from "lucide-react";

const AppFooter = () => {
    return (
        <footer className="bg-black text-neutral-500 py-12 border-t border-neutral-900">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <Smartphone className="w-6 h-6 text-amber-500" />
                    <span className="text-2xl font-black text-white">SAI Technologie</span>
                </div>
                <div className="text-sm">&copy; 2024 SAI Technologie - Accès Réservé</div>
            </div>
        </footer>
    );
};

export default AppFooter;
