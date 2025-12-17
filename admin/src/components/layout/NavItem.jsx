export default function NavItem({ icon: Icon, label, active, onClick, collapsed }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center py-3 rounded-lg transition-all duration-200 group relative ${
                active ? "bg-amber-500 text-black font-bold" : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            } ${collapsed ? "justify-center px-2" : "px-4"}`}
            title={collapsed ? label : ""}
        >
            <Icon className={`w-5 h-5 ${collapsed ? "" : "mr-3"} flex-shrink-0`} />
            {!collapsed && <span className="whitespace-nowrap overflow-hidden transition-all duration-300">{label}</span>}
            {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {label}
                </div>
            )}
        </button>
    );
}
