import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyMessage = "No data found",
  emptyIcon,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
        <p className="text-sm font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 first:pl-0 last:pr-0",
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr key={keyExtractor(item)} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "py-3 px-4 text-gray-700 first:pl-0 last:pr-0",
                    col.className,
                  )}
                >
                  {col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
