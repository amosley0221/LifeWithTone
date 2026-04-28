"use client";

import { useEffect, useState, useCallback } from "react";

interface Comment {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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

  return (
    <section className="lwt-comments">
      <h3>Comments</h3>
      <div className="lwt-comments-sub">
        {comments.length === 0
          ? "Be the first to say something."
          : `${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
      </div>

      <form onSubmit={submit} className="lwt-comment-form">
        <input
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          data-cursor-label="Name"
          required
        />
        <textarea
          placeholder="Say something nice…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          data-cursor-label="Write"
          required
        />
        <div className="lwt-comment-form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="lwt-btn-primary"
            data-cursor-label="Post"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </div>
      </form>

      {comments.map((c) => (
        <div key={c.id} className="lwt-comment">
          <div className="lwt-comment-head">
            <span className="lwt-comment-name">{c.author}</span>
            <span className="lwt-comment-date">{fmtDate(c.createdAt)}</span>
          </div>
          <p className="lwt-comment-body">{c.body}</p>
        </div>
      ))}
    </section>
  );
}
