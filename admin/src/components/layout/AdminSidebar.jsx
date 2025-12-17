import React from "react";
import {
    LayoutDashboard,
    Layers,
    Settings,
    ShoppingCart,
    Users,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Smartphone,
} from "lucide-react";

function NavItem({ icon: Icon, label, active, onClick, collapsed }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center py-3 rounded-lg transition-all duration-200 group relative ${
                active ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            } ${collapsed ? "justify-center px-2" : "px-4"}`}
            title={collapsed ? label : ""}
        >
            <Icon className={`w-5 h-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
            {!collapsed && <span className="whitespace-nowrap overflow-hidden">{label}</span>}
            {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {label}
                </div>
            )}
        </button>
    );
}

export default function AdminSidebar({
                                         view,
                                         setView,
                                         collapsed,
                                         setCollapsed,
                                         onLogout,
                                     }) {
    return (
        <aside
            className={`${collapsed ? "w-20" : "w-64"} bg-black text-white flex-shrink-0 flex flex-col fixed h-full border-r border-neutral-800 transition-all duration-300 z-20 shadow-xl`}
        >
            <div className={`h-20 flex items-center ${collapsed ? "justify-center px-0" : "px-6"} border-b border-neutral-800 relative`}>
                <Smartphone className="w-8 h-8 text-amber-500 flex-shrink-0" />
                {!collapsed && (
                    <div className="ml-3 overflow-hidden whitespace-nowrap">
                        <h1 className="font-black text-lg tracking-wider">
                            SAI <span className="text-amber-500">ADMIN</span>
                        </h1>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Back-Office</p>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-8 bg-amber-500 text-black rounded-full p-1 shadow-md hover:bg-amber-400 border-2 border-black transition-transform hover:scale-110 z-30"
                >
                    {collapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
                <NavItem icon={LayoutDashboard} label="Dashboard" active={view === "dashboard"} onClick={() => setView("dashboard")} collapsed={collapsed} />

                <div className={`pt-6 pb-2 text-xs font-bold text-neutral-600 uppercase tracking-widest ${collapsed ? "opacity-0 h-0 p-0 overflow-hidden" : "px-4"}`}>
                    Catalogue
                </div>
                <NavItem icon={Smartphone} label="Marques" active={view === "marques"} onClick={() => setView("marques")} collapsed={collapsed} />
                <NavItem icon={Layers} label="Catégories" active={view === "categories"} onClick={() => setView("categories")} collapsed={collapsed} />
                <NavItem icon={Settings} label="Pièces" active={view === "pieces"} onClick={() => setView("pieces")} collapsed={collapsed} />

                <div className={`pt-6 pb-2 text-xs font-bold text-neutral-600 uppercase tracking-widest ${collapsed ? "opacity-0 h-0 p-0 overflow-hidden" : "px-4"}`}>
                    Ventes
                </div>
                <NavItem icon={ShoppingCart} label="Commandes" active={view === "orders"} onClick={() => setView("orders")} collapsed={collapsed} />

                <div className={`pt-6 pb-2 text-xs font-bold text-neutral-600 uppercase tracking-widest ${collapsed ? "opacity-0 h-0 p-0 overflow-hidden" : "px-4"}`}>
                    Administration
                </div>
                <NavItem icon={Users} label="Utilisateurs" active={view === "users"} onClick={() => setView("users")} collapsed={collapsed} />
            </nav>

            <div className="p-4 border-t border-neutral-800">
                <button
                    onClick={onLogout}
                    className={`w-full flex items-center py-3 rounded-lg transition-all duration-200 group text-red-500 hover:bg-red-900/20 hover:text-red-400 ${
                        collapsed ? "justify-center px-2" : "px-4"
                    }`}
                    title="Déconnexion"
                >
                    <LogOut className={`w-5 h-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
                    {!collapsed && <span className="whitespace-nowrap font-bold">Déconnexion</span>}
                </button>
            </div>
        </aside>
    );
}
