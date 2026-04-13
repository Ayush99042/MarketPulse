import { useEffect, useRef, useState } from "react";

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const move = (e) => {
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

    const handleMouseOver = (e) => {
      const target = e.target;

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

  return (
    <>
      <style>{`body { cursor: none; }`}</style>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-5 h-5 rounded-full pointer-events-none z-50
                    backdrop-blur-md border border-white/30
                    ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{ willChange: "transform" }}
      />
      <div
        ref={glowRef}
        className={`fixed top-0 left-0 w-20 h-20 rounded-full pointer-events-none z-40
                    bg-indigo-500/30 blur-2xl
                    ${hidden ? "opacity-0" : "opacity-100"}`}
        style={{ willChange: "transform" }}
      />
    </>
  );
};
