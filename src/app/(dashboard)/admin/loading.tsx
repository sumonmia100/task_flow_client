import { CardSkeleton, TableSkeleton } from "@/components/skeletons/CardSkeleton";

export default function AdminLoading() {
  return (
    <div>
      <div className="mb-6 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <TableSkeleton rows={5} cols={4} />
      </div>
    </div>
  );
}
