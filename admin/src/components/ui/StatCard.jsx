import { Loader } from "lucide-react";
import { cxColor } from "../../utils/colors";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", loading = false }) {
    const c = cxColor(color);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
            <div className={`p-4 rounded-lg ${c.bg50} ${c.text600}`}>
                <Icon className="w-8 h-8" />
            </div>
            <div>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-black text-neutral-800 mt-1">
                    {loading ? <Loader className="w-6 h-6 animate-spin" /> : value}
                </h3>
                {subtitle && <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}
