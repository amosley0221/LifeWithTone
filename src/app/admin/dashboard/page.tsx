"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

interface Post {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
  category: { name: string; slug: string };
  _count: { comments: number; likes: number };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
    }
  }, [status]);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts?all=true");
    if (res.ok) {
      setPosts(await res.json());
    }
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((p) => p.filter((post) => post.id !== id));
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) {
      setPosts((p) =>
        p.map((post) =>
          post.id === id ? { ...post, published: !published } : post
        )
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <Link
          href="/admin/editor"
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors"
        >
          <FaPlus size={12} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-muted mb-4">No posts yet.</p>
          <Link
            href="/admin/editor"
            className="text-accent hover:text-accent-hover text-sm"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between bg-bg-card border border-border rounded-lg px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {post.title}
                  </h3>
                  <span
                    className={`shrink-0 px-2 py-0.5 text-xs rounded-full ${
                      post.published
                        ? "bg-success/15 text-success"
                        : "bg-text-muted/15 text-text-muted"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                  <span>{post.category.name}</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span>{post._count.likes} likes</span>
                  <span>{post._count.comments} comments</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => togglePublish(post.id, post.published)}
                  className="px-3 py-1 text-xs border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                >
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <Link
                  href={`/admin/editor/${post.id}`}
                  className="p-2 text-text-muted hover:text-accent transition-colors"
                >
                  <FaEdit size={14} />
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 text-text-muted hover:text-danger transition-colors"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
