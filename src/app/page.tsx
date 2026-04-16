import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SITE_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

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
      {/* About section */}
      <section className="mb-16">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Profile image */}
          {settings?.profileImage ? (
            <div className="shrink-0 w-36 h-36 rounded-full overflow-hidden border-2 border-border">
              <img
                src={settings.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="shrink-0 w-36 h-36 rounded-full bg-bg-card border-2 border-border flex items-center justify-center">
              <span className="text-4xl text-text-muted">T</span>
            </div>
          )}

          {/* Name and bio */}
          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-text-primary mb-3">
              {SITE_NAME}
            </h1>
            {settings?.bio ? (
              <p className="text-text-secondary leading-relaxed max-w-lg whitespace-pre-wrap">
                {settings.bio}
              </p>
            ) : (
              <p className="text-text-muted max-w-lg">
                Stories, thoughts, and moments from my world &mdash; technology,
                music, travel, and everything in between.
              </p>
            )}
          </div>
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
