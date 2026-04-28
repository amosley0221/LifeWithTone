"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = posRef.current;
      const t = targetRef.current;
      p.x += (t.x - p.x) * 0.28;
      p.y += (t.y - p.y) * 0.28;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (posRef.current.x < 0) posRef.current = { ...targetRef.current };

      const target = e.target as Element | null;
      const el = target?.closest?.(
        '[data-cursor-label], a, button, input, textarea, select, [role="button"]'
      );
      if (el) {
        const lbl = el.getAttribute("data-cursor-label");
        setLabel(lbl ?? "");
        setHovering(true);
      } else {
        setHovering(false);
        setLabel("");
      }
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      targetRef.current = { x: -100, y: -100 };
      setHovering(false);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="lwt-cursor-wrap" aria-hidden="true">
      <div
        className={`lwt-cursor-dot${hovering ? " hover" : ""}${
          pressed ? " press" : ""
        }${label ? " with-label" : ""}`}
      >
        {label && <span className="lwt-cursor-text">{label}</span>}
      </div>
    </div>
  );
}
