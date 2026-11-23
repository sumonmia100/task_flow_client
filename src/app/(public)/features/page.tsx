import type { Metadata } from "next";
import { Layers, Users, CheckSquare, BarChart3, Shield, Bell, Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore all TaskFlow features — task management, team collaboration, analytics, and more.",
};

const features = [
  {
    icon: Layers,
    title: "Organization Management",
    description: "Create multiple organizations, manage teams, and keep everything neatly separated by context.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CheckSquare,
    title: "Task Tracking",
    description: "Create, assign, and track tasks with priorities, due dates, and status workflows.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite team members, assign roles (Manager/Member), and collaborate in real-time.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Visual charts and insights into your team's productivity, task completion, and project health.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Fine-grained permissions with Admin, Manager, and Member roles enforced at every level.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Bell,
    title: "Activity Logs",
    description: "Full audit trail of every action — who created, updated, or deleted what and when.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Globe,
    title: "Subscription Plans",
    description: "Free and Pro plans. Upgrade with bKash payment to unlock unlimited access.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    description: "Built with Next.js App Router and Server Components for blazing fast performance.",
    color: "bg-teal-50 text-teal-600",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Everything you need</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            TaskFlow comes packed with features to help your team stay organized and ship faster.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
