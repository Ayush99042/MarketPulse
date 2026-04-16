import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = "",
  children,
  glass = false,
  ...props
}) => {
  const glassStyles = glass
    ? "glass-liquid border-white/10 shadow-2xl rounded-3xl"
    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm rounded-xl";

  return (
    <div
      className={`border transition-all duration-300 ${glassStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
