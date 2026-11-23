import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
