import React from "react";
import { Check, AlertCircle } from "lucide-react";

const Toast = ({ notification }) => {
    if (!notification) return null;

    return (
        <div
            className={`fixed top-24 right-4 px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce flex items-center border ${
                notification.type === "success"
                    ? "bg-black border-amber-500 text-amber-500"
                    : "bg-red-600 text-white border-red-700"
            }`}
        >
            {notification.type === "success" ? (
                <Check className="w-5 h-5 mr-3" />
            ) : (
                <AlertCircle className="w-5 h-5 mr-3" />
            )}
            <span className="font-bold">{notification.message}</span>
        </div>
    );
};

export default Toast;
