"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">
          {/* Hamburger menu button - left side */}
          <div className="relative" ref={menuRef}>
            <button
              className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-bg-secondary border border-border rounded-lg shadow-xl overflow-hidden">
                {/* Category links */}
                <div className="py-2">
                  <p className="px-4 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Categories
                  </p>
                  {CATEGORIES.map((cat) => {
                    const isActive = pathname.startsWith(
                      `/category/${cat.slug}`
                    );
                    return (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className={`block px-4 py-2 text-sm font-medium transition-colors ${
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
          </div>

          {/* Logo - centered */}
          <div className="flex-1 flex justify-center">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-text-primary hover:text-accent transition-colors"
            >
              {SITE_NAME}
            </Link>
          </div>

          {/* Spacer to balance the hamburger width */}
          <div className="w-10" />
        </div>
      </div>
    </nav>
  );
}
