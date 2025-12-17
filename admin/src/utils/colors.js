export const COLOR = {
    amber: {
        bg50: "bg-amber-50",
        bg100: "bg-amber-100",
        text600: "text-amber-600",
        text700: "text-amber-700",
        border100: "border-amber-100",
        border200: "border-amber-200",
    },
    green: {
        bg50: "bg-green-50",
        bg100: "bg-green-100",
        text600: "text-green-600",
        text700: "text-green-700",
        border100: "border-green-100",
        border200: "border-green-200",
    },
    blue: {
        bg50: "bg-blue-50",
        bg100: "bg-blue-100",
        text600: "text-blue-600",
        text700: "text-blue-700",
        border100: "border-blue-100",
        border200: "border-blue-200",
    },
    purple: {
        bg50: "bg-purple-50",
        bg100: "bg-purple-100",
        text600: "text-purple-600",
        text700: "text-purple-700",
        border100: "border-purple-100",
        border200: "border-purple-200",
    },
    indigo: {
        bg50: "bg-indigo-50",
        bg100: "bg-indigo-100",
        text600: "text-indigo-600",
        text700: "text-indigo-700",
        border100: "border-indigo-100",
        border200: "border-indigo-200",
    },
    red: {
        bg50: "bg-red-50",
        bg100: "bg-red-100",
        text600: "text-red-600",
        text700: "text-red-700",
        border100: "border-red-100",
        border200: "border-red-200",
    },
    gray: {
        bg50: "bg-neutral-50",
        bg100: "bg-neutral-100",
        text600: "text-neutral-600",
        text700: "text-neutral-700",
        border100: "border-neutral-100",
        border200: "border-neutral-200",
    },
};

export function cxColor(name = "gray") {
    return COLOR[name] || COLOR.gray;
}
