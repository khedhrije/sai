import React from "react";
import { ShoppingCart, Menu, X, Smartphone, Settings, ClipboardList, LogOut } from "lucide-react";

const AppHeader = ({
                       username,
                       cartCount,
                       isMenuOpen,
                       onToggleMenu,
                       onToggleCart,
                       onLogout,
                       onHome,
                       onOrders,
                       onScrollCatalogue,
                   }) => {
    return (
        <nav className="sticky top-0 z-40 bg-black shadow-md border-b border-neutral-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
                        <div className="relative">
                            <Smartphone className="w-10 h-10 text-amber-500" />
                            <Settings className="w-5 h-5 text-white absolute -bottom-1 -right-1 animate-spin-slow" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-amber-500 tracking-wider leading-none">SAI</span>
                            <span className="text-[10px] text-white uppercase tracking-widest font-medium">Technologie</span>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 font-medium text-neutral-400 text-sm uppercase tracking-wide">
                        <button onClick={onHome} className="hover:text-amber-500 transition-colors">
                            Accueil
                        </button>
                        <button onClick={onScrollCatalogue} className="hover:text-amber-500 transition-colors">
                            Catalogue
                        </button>
                        <button onClick={onOrders} className="hover:text-amber-500 transition-colors flex items-center gap-2">
                            <ClipboardList className="w-4 h-4" /> Commandes
                        </button>

                        <div className="flex items-center gap-2 text-amber-500 border border-amber-500/30 px-3 py-1 rounded-full bg-amber-500/10">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Connecté : {username}
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-neutral-800 rounded-full transition relative group" onClick={onToggleCart}>
                            <ShoppingCart className="w-6 h-6 text-neutral-300 group-hover:text-amber-500 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
                            )}
                        </button>

                        <button
                            className="p-2 hover:bg-red-900/50 hover:text-red-500 rounded-full transition text-neutral-500"
                            onClick={onLogout}
                            title="Déconnexion"
                        >
                            <LogOut className="w-6 h-6" />
                        </button>

                        <button className="md:hidden p-2 text-neutral-300 hover:text-white" onClick={onToggleMenu}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AppHeader;
