"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const onEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const onLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  };

  const isHome = pathname === "/";
  const isAll = pathname === "/all" || pathname.startsWith("/all/");
  const activeSlug = pathname.startsWith("/category/")
    ? pathname.split("/")[2]
    : null;

  return (
    <header className="lwt-topbar">
      <Link href="/" className="lwt-brand" data-cursor-label="Home">
        <i></i>
        <span>{SITE_NAME}</span>
        <span className="lwt-brand-sub">Est. 2026</span>
      </Link>

      <div
        className={`lwt-menu${open ? " open" : ""}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <button
          className="lwt-menu-btn"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          data-cursor-label={open ? "Close" : "Menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="lwt-menu-panel" aria-hidden={!open}>
          <div className="lwt-menu-eyebrow">Sections</div>
          <ul className="lwt-menu-list">
            <li style={{ ["--i" as never]: 0 }}>
              <Link
                href="/"
                className={`lwt-menu-link${isHome ? " active" : ""}`}
                data-cursor-label="Home"
                onClick={() => setOpen(false)}
              >
                <span>Home</span>
                <span className="lwt-menu-link-hint">Front page</span>
              </Link>
            </li>
            {CATEGORIES.map((c, i) => (
              <li key={c.slug} style={{ ["--i" as never]: i + 1 }}>
                <Link
                  href={`/category/${c.slug}`}
                  className={`lwt-menu-link${
                    activeSlug === c.slug ? " active" : ""
                  }`}
                  data-cursor-label="Open"
                  onClick={() => setOpen(false)}
                >
                  <span>{c.name}</span>
                  <span className="lwt-menu-link-hint">{c.hint}</span>
                </Link>
              </li>
            ))}
            <li style={{ ["--i" as never]: CATEGORIES.length + 1 }}>
              <Link
                href="/all"
                className={`lwt-menu-link${isAll ? " active" : ""}`}
                data-cursor-label="All"
                onClick={() => setOpen(false)}
              >
                <span>All Writing</span>
                <span className="lwt-menu-link-hint">
                  Everything, newest first
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
