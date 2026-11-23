import { CardSkeleton } from "@/components/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <div>
      <div className="mb-6 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-56 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="h-5 bg-gray-100 rounded w-32 mb-4" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="flex justify-between py-2 border-b border-gray-50">
                <div className="h-4 bg-gray-100 rounded w-40" />
                <div className="h-5 bg-gray-100 rounded-full w-16" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
