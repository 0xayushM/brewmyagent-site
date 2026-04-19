import { useState, useEffect } from "react";

export const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const updateMousePosition = (e: MouseEvent) => {
        // Use pageX and pageY to get coordinates relative to the entire document
        setMousePosition({ x: e.pageX, y: e.pageY });
    }

    useEffect(() => {
        window.addEventListener("mousemove", updateMousePosition);
        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return mousePosition;
};