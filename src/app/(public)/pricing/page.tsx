import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for TaskFlow. Free plan available. Upgrade to Pro anytime.",
};

const plans = [
  {
    name: "Free",
    price: "৳0",
    period: "/month",
    description: "Perfect for small teams getting started",
    features: [
      { text: "1 Organization", included: true },
      { text: "Up to 3 Projects", included: true },
      { text: "5 Team Members", included: true },
      { text: "Basic Task Management", included: true },
      { text: "Basic Reports", included: true },
      { text: "Advanced Analytics", included: false },
      { text: "Audit Logs", included: false },
      { text: "Priority Support", included: false },
    ],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "৳999",
    period: "/month",
    description: "For growing teams that need more power",
    features: [
      { text: "Unlimited Organizations", included: true },
      { text: "Unlimited Projects", included: true },
      { text: "Unlimited Members", included: true },
      { text: "Full Task Management", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Audit Logs", included: true },
      { text: "Priority Support", included: true },
      { text: "bKash Payment", included: true },
    ],
    cta: "Start Pro Plan",
    href: "/register",
    highlighted: true,
  },
];

const faqs = [
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. You can upgrade to Pro at any time by making a payment through bKash. Downgrades apply at the end of the billing cycle.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We currently accept bKash (Test Mode). More payment options coming soon.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "The Free plan is available indefinitely. We don't offer a time-limited Pro trial, but you can explore all features with the Free plan first.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is never deleted immediately. You have a 30-day grace period to export or renew your subscription.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple Pricing</h1>
          <p className="text-xl text-blue-100 max-w-xl mx-auto">
            Start free. Upgrade when your team needs more.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${plan.highlighted ? "bg-blue-600 text-white shadow-xl" : "bg-white border border-gray-200"}`}
              >
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <CheckCircle size={16} className={plan.highlighted ? "text-blue-200" : "text-blue-600"} />
                      ) : (
                        <X size={16} className={plan.highlighted ? "text-blue-400" : "text-gray-300"} />
                      )}
                      <span className={`${!f.included ? "opacity-50" : ""} ${plan.highlighted ? "text-blue-100" : "text-gray-600"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="border border-gray-100 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
