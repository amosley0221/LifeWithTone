"use client";

import { useEffect, useState, useCallback } from "react";

interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    const res = await fetch(`/api/posts/${postId}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !body.trim()) return;
    setSubmitting(true);

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author: author.trim(), body: body.trim() }),
    });

    if (res.ok) {
      setBody("");
      fetchComments();
    }
    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <form onSubmit={submit} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          required
        />
        <textarea
          placeholder="Write a comment..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comment list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-text-muted text-sm">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-bg-tertiary rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-accent">
                  {c.author}
                </span>
                <span className="text-xs text-text-muted">
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
