export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="w-10 h-10 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-7 bg-gray-100 rounded w-16 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  const widths = [65, 80, 70, 90, 75, 60, 85, 72];
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4 first:pl-0 last:pr-0">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${widths[i % widths.length]}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="py-3 px-4 first:pl-0 last:pr-0">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-6 animate-pulse">
      <div className="h-7 bg-gray-100 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-72" />
    </div>
  );
}
