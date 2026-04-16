import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      category: true,
      _count: { select: { comments: true, likes: true } },
    },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-text-primary mb-4">
          {SITE_NAME}
        </h1>
        <p className="text-lg text-text-secondary max-w-xl mx-auto">
          Stories, thoughts, and moments from my world &mdash; technology,
          music, travel, and everything in between.
        </p>
      </section>

      {/* Category grid */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">
          Explore
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group px-4 py-3 bg-bg-card border border-border rounded-lg text-center transition-all hover:border-accent/50 hover:bg-bg-tertiary"
            >
              <span className="text-sm font-medium text-text-secondary group-hover:text-accent transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-6">
            Recent Posts
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/category/${post.category.slug}/${post.id}`}
                className="group block bg-bg-card border border-border rounded-lg overflow-hidden transition-all hover:border-accent/50"
              >
                {post.imageUrl && (
                  <div className="aspect-video bg-bg-tertiary overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-xs text-accent font-medium">
                    {post.category.name}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary mt-1 group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-muted mt-2">
                    {formatDate(post.createdAt)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                    <span>{post._count.likes} likes</span>
                    <span>{post._count.comments} comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentPosts.length === 0 && (
        <section className="text-center py-12">
          <p className="text-text-muted">No posts yet. Check back soon!</p>
        </section>
      )}
    </div>
  );
}
