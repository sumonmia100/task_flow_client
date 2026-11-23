import { TableSkeleton } from "@/components/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-6 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-56" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <TableSkeleton rows={8} cols={5} />
      </div>
    </div>
  );
}
