import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Layers, Users, Zap, BarChart3, Shield, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "TaskFlow — Project Management SaaS",
  description:
    "Manage projects, collaborate with your team, and ship faster with TaskFlow.",
};

const features = [
  {
    icon: Layers,
    title: "Project Organization",
    description:
      "Create organizations, manage multiple projects, and keep everything structured.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite members, assign tasks, and work together in real-time.",
  },
  {
    icon: Zap,
    title: "Task Management",
    description:
      "Kanban boards, priorities, due dates — everything to keep your team on track.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Visual dashboards and reports to track progress and productivity.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Admin, Manager, and Member roles with strict permission control.",
  },
  {
    icon: Globe,
    title: "Activity Logs",
    description:
      "Full audit trail of every action across your organization.",
  },
];

const plans = [
  {
    name: "Free",
    price: "৳0",
    period: "/month",
    features: ["1 Organization", "Up to 3 Projects", "5 Team Members", "Basic Reports"],
    cta: "Get Started",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "৳999",
    period: "/month",
    features: [
      "Unlimited Organizations",
      "Unlimited Projects",
      "Unlimited Members",
      "Advanced Analytics",
      "Priority Support",
      "Audit Logs",
    ],
    cta: "Start Pro",
    href: "/register",
    highlighted: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block bg-blue-500/30 text-blue-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🚀 Project Management Made Simple
          </span>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Ship projects faster
            <br />
            <span className="text-blue-200">with your team</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            TaskFlow brings your projects, tasks, and team together in one
            place. From idea to delivery — stay organized, stay on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              Demo Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything your team needs
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              A complete toolkit to plan, execute, and deliver projects on time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600" size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500 text-lg">
              Start free. Upgrade when your team grows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-xl scale-105"
                    : "bg-white border border-gray-200"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-2 ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-end gap-1 mb-6">
                  <span
                    className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm mb-1 ${plan.highlighted ? "text-blue-200" : "text-gray-500"}`}
                  >
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        size={16}
                        className={plan.highlighted ? "text-blue-200" : "text-blue-600"}
                      />
                      <span className={plan.highlighted ? "text-blue-100" : "text-gray-600"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center font-semibold py-3 rounded-lg transition-colors ${
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to get started?
        </h2>
        <p className="text-blue-100 text-lg mb-8 max-w-lg mx-auto">
          Join thousands of teams already using TaskFlow to manage their projects.
        </p>
        <Link
          href="/register"
          className="bg-white text-blue-600 font-semibold px-8 py-3.5 rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
        >
          Start for Free <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
