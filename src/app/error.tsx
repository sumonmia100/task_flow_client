"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-2">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono mb-6">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-6 rounded-xl transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
