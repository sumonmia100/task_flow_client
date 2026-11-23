import type { Metadata } from "next";
import { Users, Target, Zap, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TaskFlow and our mission to simplify project management for teams.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About TaskFlow</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            We built TaskFlow to help teams collaborate better and ship projects on time.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                TaskFlow was built with a simple goal: make project management accessible and effective for every team, regardless of size or industry. We believe that great software should feel effortless.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Build</h2>
              <p className="text-gray-600 leading-relaxed">
                A complete project management SaaS — from task tracking and team collaboration to billing and analytics. Everything your team needs in one clean, fast interface.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Mission-Driven", desc: "Built to solve real team problems" },
              { icon: Users, title: "Team-First", desc: "Designed for collaboration at scale" },
              { icon: Zap, title: "Fast & Reliable", desc: "Performance and uptime guaranteed" },
              { icon: Heart, title: "User-Focused", desc: "Feedback shapes every feature" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
