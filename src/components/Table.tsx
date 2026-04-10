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
    className={`bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400 sticky top-0 z-10 shadow-sm border-b border-gray-200 dark:border-gray-700 ${className}`}
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
    className={`divide-y divide-gray-200 dark:divide-gray-800 ${className}`}
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
    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
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
