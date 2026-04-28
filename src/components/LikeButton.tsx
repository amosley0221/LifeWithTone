"use client";

import { useEffect, useState, useCallback } from "react";

function getFingerprint(): string {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("lwt-fingerprint");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("lwt-fingerprint", fp);
  }
  return fp;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bump, setBump] = useState(false);

  const fetchStatus = useCallback(async () => {
    const fp = getFingerprint();
    const res = await fetch(`/api/posts/${postId}/like?fingerprint=${fp}`);
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    }
  }, [postId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);
    setBump(true);
    setTimeout(() => setBump(false), 350);

    const fp = getFingerprint();
    setLiked(!liked);
    setCount((c) => (liked ? c - 1 : c + 1));

    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint: fp }),
    });

    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={loading}
      className={`lwt-like${liked ? " liked" : ""}${bump ? " bump" : ""}`}
      data-cursor-label={liked ? "Unlike" : "Like"}
    >
      <HeartIcon filled={liked} />
      <span>{count}</span>
    </button>
  );
}
