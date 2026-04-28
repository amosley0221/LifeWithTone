"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="lwt-modal-scrim" style={{ position: "static", minHeight: "calc(100vh - 200px)" }}>
      <div className="lwt-modal">
        <div className="lwt-modal-eyebrow">Restricted</div>
        <h3 className="lwt-modal-title">Admin sign in</h3>
        <p className="lwt-modal-sub">
          Only Tone can post. Visitors can read, like, and comment without
          signing in.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="lwt-field">
            <div className="lwt-field-label">Username</div>
            <input
              type="text"
              className="lwt-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              data-cursor-label="Type"
              autoFocus
              required
            />
          </div>

          <div className="lwt-field">
            <div className="lwt-field-label">Password</div>
            <input
              type="password"
              className={`lwt-input${error ? " shake" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-cursor-label="Type"
              required
            />
          </div>

          {error && <div className="lwt-modal-error">{error}</div>}

          <div className="lwt-modal-foot">
            <button
              type="submit"
              disabled={loading}
              className="lwt-btn-primary"
              data-cursor-label="Enter"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
