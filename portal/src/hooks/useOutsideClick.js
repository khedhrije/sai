import { useEffect } from "react";

export const useOutsideClick = (ref, onOutside) => {
    useEffect(() => {
        const handler = (event) => {
            if (!ref?.current) return;
            if (!ref.current.contains(event.target)) onOutside?.(event);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [ref, onOutside]);
};
