"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "MANAGER"
        ? "/dashboard"
        : "/member";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">TF</span>
          </div>
          <span className="font-bold text-gray-900">TaskFlow</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href={dashboardHref}
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm text-gray-600 hover:text-gray-900 py-1"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                href={dashboardHref}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 font-medium py-1" onClick={() => setMenuOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
