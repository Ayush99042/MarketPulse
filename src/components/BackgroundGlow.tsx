import { useEffect, useState } from "react";

export const BackgroundGlow = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `
          radial-gradient(
            circle at ${position.x}% ${position.y}%,
            rgba(99, 102, 241, 0.30),
            transparent 25%
          ),
          #020617
        `,
      }}
    />
  );
};
