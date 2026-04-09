import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ className = '', children, glass = false, ...props }) => {
  const glassStyles = glass 
    ? 'bg-white/10 dark:bg-gray-900/40 backdrop-blur-3xl border-white/20 dark:border-white/5 shadow-2xl rounded-[2.5rem]' 
    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm rounded-xl';

  return (
    <div
      className={`border transition-all duration-300 ${glassStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
