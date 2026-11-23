export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-100 rounded w-40 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-56" />
        </div>
        <div className="h-10 bg-gray-100 rounded-lg w-40 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-6 animate-pulse">
            <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3" />
            <div className="h-5 bg-gray-100 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-48 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
