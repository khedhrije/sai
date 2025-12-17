import React from "react";

export default function AppHeader({ title, subtitle }) {
    return (
        <header className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-3xl font-black text-neutral-900">{title}</h2>
                <p className="text-neutral-500">{subtitle}</p>
            </div>
        </header>
    );
}
