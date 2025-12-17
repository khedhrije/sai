export default function Button({
                                   children,
                                   onClick,
                                   variant = "primary",
                                   className = "",
                                   disabled = false,
                                   type = "button",
                                   ...props
                               }) {
    const base =
        "px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm";

    const variants = {
        primary: "bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-50",
        secondary: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
        outline: "border border-neutral-300 text-neutral-600 hover:bg-neutral-50",
        ghost: "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100",
        success: "bg-green-500 text-white hover:bg-green-600 disabled:opacity-50",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
