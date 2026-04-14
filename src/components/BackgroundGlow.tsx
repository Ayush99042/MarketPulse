import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

export const BackgroundGlow = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isLight = theme === "light";

  const glowColor = isLight
    ? "rgba(6, 182, 212, 0.15)"
    : "rgba(99, 102, 241, 0.30)";
  const baseColor = isLight ? "#f8fafc" : "#020617";

  return (
    <div
      className="fixed inset-0 -z-10 transition-colors duration-500"
      style={{
        background: `
          radial-gradient(
            circle at ${position.x}% ${position.y}%,
            ${glowColor},
            transparent 25%
          ),
          ${baseColor}
        `,
      }}
    />
  );
};
