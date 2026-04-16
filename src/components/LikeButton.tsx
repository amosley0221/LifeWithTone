"use client";

import { useEffect, useState, useCallback } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function getFingerprint(): string {
  if (typeof window === "undefined") return "";
  let fp = localStorage.getItem("lwt-fingerprint");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("lwt-fingerprint", fp);
  }
  return fp;
}

export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

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
      onClick={toggleLike}
      disabled={loading}
      className="flex items-center gap-2 text-sm transition-colors group"
    >
      {liked ? (
        <FaHeart className="text-red-500" size={18} />
      ) : (
        <FaRegHeart
          className="text-text-muted group-hover:text-red-400"
          size={18}
        />
      )}
      <span className="text-text-secondary">{count}</span>
    </button>
  );
}
