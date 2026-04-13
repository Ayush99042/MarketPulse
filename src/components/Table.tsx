import React from "react";

export const Table: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <table
      className={`w-full text-left text-sm text-gray-500 dark:text-gray-400 border-collapse ${className}`}
    >
      {children}
    </table>
  );
};

export const TableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <thead
    className={`glass-liquid text-[10px] uppercase tracking-widest text-gray-500/60 sticky top-0 z-10 border-b border-white/5 ${className}`}
  >
    <tr>{children}</tr>
  </thead>
);

export const Th: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <th className={`px-6 py-4 font-medium ${className}`} {...props}>
    {children}
  </th>
);

export const TableBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <tbody
    className={`divide-y divide-white/5 ${className}`}
  >
    {children}
  </tbody>
);

export const Tr: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className = "",
  onClick,
  ...props
}) => (
  <tr
    onClick={onClick}
    className={`hover:bg-white/5 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
    {...props}
  >
    {children}
  </tr>
);

export const Td: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = "",
  ...props
}) => (
  <td className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </td>
);
