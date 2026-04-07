import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  Td,
  TableHeader,
  Tr,
  Th
} from "./Table";
import { Button } from './Button';

export type Column<T> = {
  header: React.ReactNode;
  accessor?: keyof T;
  align?: "left" | "center" | "right";
  cell: (row: T) => React.ReactNode;
};

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];

  isLoading?: boolean;
  isError?: boolean;

  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading,
  isError,
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onLimitChange,
  onRowClick
}: DataTableProps<T>) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
      <div className="flex-1 overflow-y-auto rounded-t-lg relative">
        <Table>
          <TableHeader>
            {columns.map((col, index) => {
              return (
                <Th
                  key={index}
                  className={`
                    px-6 py-4 text-${col.align ?? "left"}
                    text-sm font-semibold uppercase text-gray-500 dark:text-gray-400
                  `}
                >
                  <div
                    className={`flex items-center gap-2 ${col.align === "center"
                      ? "justify-center"
                      : col.align === "right"
                        ? "justify-end"
                        : "justify-start"
                      }`}
                  >
                    <span>{col.header}</span>
                  </div>
                </Th>
              );
            })}
          </TableHeader>

          <TableBody className="whitespace-nowrap">
            {isLoading ? (
              <Tr>
                <Td colSpan={columns.length} className="p-0">
                  <div className="flex items-center justify-center min-h-[200px] w-full">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-600 dark:border-t-white" />
                  </div>
                </Td>
              </Tr>
            ) : isError ? (
              <Tr>
                <Td colSpan={columns.length} className="p-0">
                  <div className="flex items-center justify-center min-h-[200px] w-full">
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      Failed to load data
                    </p>
                  </div>
                </Td>
              </Tr>
            ) : data.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} className="p-0">
                  <div className="flex items-center justify-center min-h-[250px] w-full">
                    <div className="text-center space-y-2">
                      <p className="font-medium text-gray-600 dark:text-gray-300">
                        No data available
                      </p>
                      <p className="text-xs text-gray-400">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                </Td>
              </Tr>
            ) : (
              data.map((row, rowIndex) => (
                <Tr
                  key={rowIndex}
                  className="group"
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col, colIndex) => (
                    <Td
                      key={colIndex}
                      className="px-6 py-4 align-middle"
                    >
                      <div
                        className={`flex w-full ${col.align === "center"
                          ? "justify-center"
                          : col.align === "right"
                            ? "justify-end"
                            : "justify-start"
                          }`}
                      >
                        {col.cell(row)}
                      </div>
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(onPageChange || onLimitChange) && total > 0 && (
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/80 rounded-b-lg">
          {onLimitChange && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Rows per page:
              </label>
              <div className="relative">
                <select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="appearance-none border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {[5, 10, 50, 100].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          )}

          {onPageChange && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Page <span className="font-medium text-gray-900 dark:text-white">{page}</span> of <span className="font-medium text-gray-900 dark:text-white">{Math.max(1, Math.ceil(total / limit))}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => onPageChange(page - 1)}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page * limit >= total}
                  onClick={() => onPageChange(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
