import React, { useMemo, useState } from "react";
import { Loader, AlertCircle } from "lucide-react";

import LoginScreen from "./components/auth/LoginScreen";
import Toast from "./components/ui/Toast";
import AppHeader from "./components/layout/AppHeader";
import AppFooter from "./components/layout/AppFooter";
import CartSidebar from "./components/cart/CartSidebar";

import HomeView from "./views/HomeView";
import OrdersView from "./views/OrdersView";
import ProductView from "./views/ProductView";

import { loginCustomer } from "./services/auth";
import { loadCatalogue } from "./services/catalogue";
import { updateProductStock } from "./services/stock";
import { fetchUserOrders, cancelOrder, createOrder } from "./services/orders";

const App = () => {
    // Auth
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState(null);
    const [loginError, setLoginError] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Data
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState(["Tout", "Universel"]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [error, setError] = useState(null);

    // Orders
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);

    // Navigation
    const [currentView, setCurrentView] = useState("home"); // home | product | orders
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    // Filters
    const [selectedBrand, setSelectedBrand] = useState("Tout");
    const [selectedType, setSelectedType] = useState("Tout");

    // Search
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Cart + UI
    const [cart, setCart] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Product page state
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0).toFixed(3);

    const availableTypes = useMemo(() => {
        const types = new Set(["Tout"]);
        products.forEach((p) => {
            if (selectedBrand === "Tout" || p.brand === selectedBrand) types.add(p.type);
        });
        return Array.from(types);
    }, [products, selectedBrand]);

    const filteredProducts = useMemo(() => {
        const t = searchTerm.toLowerCase();
        return products.filter((p) => {
            const matchesBrand = selectedBrand === "Tout" || p.brand === selectedBrand;
            const matchesType = selectedType === "Tout" || p.type === selectedType;
            const matchesSearch = p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t) || p.type.toLowerCase().includes(t);
            return matchesBrand && matchesType && matchesSearch;
        });
    }, [products, selectedBrand, selectedType, searchTerm]);

    const suggestions = useMemo(() => {
        const t = searchTerm.toLowerCase();
        if (!t) return [];
        return products
            .filter((p) => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t) || p.type.toLowerCase().includes(t))
            .slice(0, 5);
    }, [products, searchTerm]);

    const scrollCatalogue = () => {
        document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" });
    };

    const loadData = async () => {
        try {
            setIsLoadingData(true);
            setError(null);
            const { brands, products } = await loadCatalogue();
            setBrands(brands);
            setProducts(products);
        } catch (e) {
            console.error(e);
            setError("Impossible de charger le catalogue.");
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setLoginError("");

        try {
            const res = await loginCustomer({ identifier: username, password });
            setIsAuthenticated(true);
            setUserId(res.userId);
            await loadData();
        } catch (err) {
            setLoginError(err?.message || "Erreur de connexion.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
        setUserId(null);
        setCart([]);
        setCurrentView("home");
    };

    const fetchOrders = async () => {
        if (!userId) return;
        try {
            setIsLoadingOrders(true);
            const list = await fetchUserOrders(userId);
            setOrders(list);
        } catch (e) {
            console.error(e);
            showNotification("Erreur lors de la récupération de l'historique", "error");
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) return;

        try {
            const target = orders.find((o) => o.documentId === orderId || o.id === orderId);
            if (target) {
                const pieces = target.pieces || target.attributes?.pieces?.data || [];
                for (const piece of pieces) {
                    const pId = piece.documentId || piece.id;
                    if (pId) await updateProductStock(pId, +1);
                }
            }

            const res = await cancelOrder(orderId);
            if (res.ok) {
                showNotification("Commande annulée et stock restauré", "success");
                await fetchOrders();
                await loadData();
            } else {
                showNotification("Impossible d'annuler la commande", "error");
            }
        } catch (e) {
            console.error(e);
            showNotification("Erreur réseau", "error");
        }
    };

    const addToCart = (product, qty = 1) => {
        const newItems = Array(qty).fill(product);
        setCart((prev) => [...prev, ...newItems]);
        if (currentView === "home") showNotification("Article ajouté au bon de commande", "success");
    };

    const handleAddToCartAnimation = (product, qty) => {
        setIsAdding(true);
        addToCart(product, qty);
        setTimeout(() => setIsAdding(false), 1500);
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);

        try {
            for (const item of cart) await updateProductStock(item.id, -1);

            const res = await createOrder({
                amount: parseFloat(cartTotal),
                pieceIds: cart.map((i) => i.id),
                userId,
            });

            if (res.ok) {
                setCart([]);
                setIsCartOpen(false);
                showNotification("Commande transmise et stock réservé !", "success");
                await loadData();
            } else {
                showNotification("Erreur lors de l'envoi de la commande.", "error");
            }
        } catch (e) {
            console.error(e);
            showNotification("Erreur de connexion.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const navigateToProduct = (product) => {
        setSelectedProduct(product);
        setActiveImage(product.images?.[0] || product.image);
        setQuantity(1);
        setIsAdding(false);
        setShowSuggestions(false);
        setCurrentView("product");
        window.scrollTo(0, 0);
    };

    const navigateToHome = () => {
        setCurrentView("home");
        window.scrollTo(0, 0);
    };

    const navigateToOrders = async () => {
        setCurrentView("orders");
        await fetchOrders();
        window.scrollTo(0, 0);
    };

    // LOGIN
    if (!isAuthenticated) {
        return (
            <LoginScreen
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                loginError={loginError}
                isLoggingIn={isLoggingIn}
                onSubmit={handleLogin}
            />
        );
    }

    // LOADING
    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <Loader className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold tracking-widest">CHARGEMENT DU CATALOGUE SAI...</h2>
                <p className="text-neutral-500 text-sm mt-2">Récupération des données en temps réel</p>
            </div>
        );
    }

    // ERROR
    if (error) {
        return (
            <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-neutral-800 mb-2">Erreur de chargement</h2>
                <p className="text-neutral-600 mb-6 text-center">{error}</p>
                <button onClick={loadData} className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-neutral-800">
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
            <Toast notification={notification} />

            <AppHeader
                username={username}
                cartCount={cart.length}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen((v) => !v)}
                onToggleCart={() => setIsCartOpen((v) => !v)}
                onLogout={handleLogout}
                onHome={navigateToHome}
                onOrders={navigateToOrders}
                onScrollCatalogue={() => {
                    navigateToHome();
                    setTimeout(scrollCatalogue, 100);
                }}
            />

            {currentView === "home" ? (
                <HomeView
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    showSuggestions={showSuggestions}
                    setShowSuggestions={setShowSuggestions}
                    suggestions={suggestions}
                    onPickSuggestion={navigateToProduct}
                    onScrollCatalogue={scrollCatalogue}
                    brands={brands}
                    selectedBrand={selectedBrand}
                    onSelectBrand={(brand) => {
                        setSelectedBrand(brand);
                        setSelectedType("Tout");
                    }}
                    availableTypes={availableTypes}
                    selectedType={selectedType}
                    onSelectType={setSelectedType}
                    filteredProducts={filteredProducts}
                    onOpenProduct={navigateToProduct}
                    onAddToCart={(p) => addToCart(p, 1)}
                    onResetFilters={() => {
                        setSelectedBrand("Tout");
                        setSelectedType("Tout");
                    }}
                />
            ) : currentView === "orders" ? (
                <OrdersView
                    orders={orders}
                    isLoadingOrders={isLoadingOrders}
                    onRefresh={fetchOrders}
                    onCancel={handleCancelOrder}
                    onBack={navigateToHome}
                />
            ) : (
                <ProductView
                    product={selectedProduct}
                    activeImage={activeImage}
                    setActiveImage={setActiveImage}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    isAdding={isAdding}
                    onAddToCart={() => handleAddToCartAnimation(selectedProduct, quantity)}
                    onBack={navigateToHome}
                    onCrumbBrand={() => {
                        navigateToHome();
                        setSelectedBrand(selectedProduct.brand);
                        setSelectedType("Tout");
                    }}
                    onCrumbType={() => {
                        navigateToHome();
                        setSelectedBrand("Tout");
                        setSelectedType(selectedProduct.type);
                    }}
                />
            )}

            <CartSidebar
                isOpen={isCartOpen}
                cart={cart}
                cartTotal={cartTotal}
                isSubmitting={isSubmitting}
                onClose={() => setIsCartOpen(false)}
                onPlaceOrder={handlePlaceOrder}
            />

            <AppFooter />
        </div>
    );
};

export default App;
