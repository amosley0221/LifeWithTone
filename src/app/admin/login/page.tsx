"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";

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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-text-primary text-center mb-2">
          {SITE_NAME}
        </h1>
        <p className="text-text-muted text-sm text-center mb-8">Admin Login</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3 py-2 bg-danger/10 border border-danger/30 rounded-md text-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:border-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:border-accent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
