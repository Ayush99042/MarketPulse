import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [hidden, setHidden] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      if (cursorRef.current) {
        cursorRef.current.style.transform = transform;
      }

      if (glowRef.current) {
        glowRef.current.style.transform = transform;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest(".cursor-pointer")
      ) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const isLight = theme === "light";

  return (
    <>
      <style>{`body { cursor: none; }`}</style>

      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-[9999]
                    backdrop-blur-md border ${isLight ? "border-gray-400/50" : "border-white/30"}
                    ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{ willChange: "transform" }}
      />

      <div
        ref={glowRef}
        className={`fixed top-0 left-0 w-20 h-20 rounded-full pointer-events-none z-[9998]
                    ${isLight ? "bg-indigo-400/15" : "bg-indigo-500/30"} blur-2xl
                    ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{ willChange: "transform" }}
      />
    </>
  );
};
