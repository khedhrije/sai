import React, { useState } from "react";
import { Loader, Lock, Settings, Smartphone, User, AlertCircle } from "lucide-react";
import { loginManager } from "../../services/auth";

export default function LoginScreen({ onSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");

        try {
            const info = await loginManager({ identifier: username, password });
            onSuccess(info);
        } catch (err) {
            setLoginError(err?.message || "Erreur de connexion");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10" />

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="relative mb-4">
                        <Smartphone className="w-12 h-12 text-amber-500" />
                        <Settings className="w-6 h-6 text-white absolute -bottom-1 -right-1 animate-spin-slow" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest">
                        SAI <span className="text-amber-500">ADMIN</span>
                    </h1>
                    <p className="text-neutral-500 text-sm uppercase tracking-wide mt-2">Accès Sécurisé</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-500 uppercase ml-1">Identifiant</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black border border-neutral-700 text-white pl-12 pr-4 py-3 rounded-lg focus:border-amber-500 outline-none transition-colors"
                                placeholder="Nom d'utilisateur"
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-amber-500 uppercase ml-1">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border border-neutral-700 text-white pl-12 pr-4 py-3 rounded-lg focus:border-amber-500 outline-none transition-colors"
                                placeholder="••••••••"
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>

                    {loginError && (
                        <div className="flex items-center text-red-500 text-sm bg-red-500/10 p-3 rounded border border-red-500/20">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {loginError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoggingIn}
                        className={`w-full bg-amber-500 text-black font-bold py-4 rounded-lg transition uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center justify-center ${
                            isLoggingIn ? "opacity-70 cursor-not-allowed" : "hover:bg-amber-400"
                        }`}
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin mr-2" /> Connexion...
                            </>
                        ) : (
                            "Connexion"
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-neutral-800 pt-6">
                    <p className="text-neutral-600 text-xs">Accès réservé aux administrateurs.</p>
                </div>
            </div>
        </div>
    );
}
