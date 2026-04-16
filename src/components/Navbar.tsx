"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
          >
            {SITE_NAME}
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {CATEGORIES.map((cat) => {
              const isActive = pathname.startsWith(`/category/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-bg-secondary">
          <div className="px-4 py-3 space-y-1">
            {CATEGORIES.map((cat) => {
              const isActive = pathname.startsWith(`/category/${cat.slug}`);
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
