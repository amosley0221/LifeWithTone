import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId, published: true },
    include: { category: true },
  });

  if (!post) notFound();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <span className="text-xs text-accent font-medium uppercase tracking-wider">
          {post.category.name}
        </span>
        <h1 className="text-3xl font-bold text-text-primary mt-2 mb-3">
          {post.title}
        </h1>
        <p className="text-sm text-text-muted">{formatDate(post.createdAt)}</p>
      </header>

      {/* Cover image */}
      {post.imageUrl && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {/* Body */}
      <div className="prose prose-invert prose-sm max-w-none text-text-secondary leading-relaxed whitespace-pre-wrap">
        {post.body}
      </div>

      {/* Like button */}
      <div className="mt-8 pt-4 border-t border-border">
        <LikeButton postId={post.id} />
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} />
    </article>
  );
}
