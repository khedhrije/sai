import { CheckCircle, AlertTriangle } from "lucide-react";

export default function Toast({ notification }) {
    if (!notification) return null;

    const isSuccess = notification.type === "success";

    return (
        <div
            className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-bottom-5 flex items-center border ${
                isSuccess
                    ? "bg-black border-amber-500 text-amber-500"
                    : "bg-red-600 text-white border-red-700"
            }`}
        >
            {isSuccess ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertTriangle className="w-5 h-5 mr-3" />}
            <span className="font-bold">{notification.msg}</span>
        </div>
    );
}
