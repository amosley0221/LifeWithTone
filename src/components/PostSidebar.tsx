"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface SidebarPost {
  id: string;
  title: string;
  createdAt: string;
}

export default function PostSidebar({
  posts,
  categorySlug,
}: {
  posts: SidebarPost[];
  categorySlug: string;
}) {
  const params = useParams();
  const activePostId = params?.postId as string | undefined;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-bg-secondary h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
          Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-sm text-text-muted">No posts yet.</p>
        ) : (
          <div className="space-y-1">
            {posts.map((post) => {
              const isActive = activePostId === post.id;
              return (
                <Link
                  key={post.id}
                  href={`/category/${categorySlug}/${post.id}`}
                  className={`block px-3 py-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-accent/15 border-l-2 border-accent"
                      : "hover:bg-bg-tertiary"
                  }`}
                >
                  <p
                    className={`text-sm font-medium truncate ${
                      isActive ? "text-accent" : "text-text-primary"
                    }`}
                  >
                    {post.title}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {formatDate(post.createdAt)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
