import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-8">
          Your payment was cancelled or failed. No charges were made. You can try again anytime.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/payments"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
