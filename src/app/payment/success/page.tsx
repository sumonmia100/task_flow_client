"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const trxId = searchParams.get("trxID");
  const paymentId = searchParams.get("paymentID");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-6">
          Your Pro subscription has been activated. Enjoy unlimited access to all features.
        </p>

        {(trxId || paymentId) && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            {paymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment ID</span>
                <span className="font-mono text-gray-700 text-xs">{paymentId}</span>
              </div>
            )}
            {trxId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-gray-700 text-xs">{trxId}</span>
              </div>
            )}
          </div>
        )}

        <Link
          href="/dashboard"
          className="block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
