import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmtDate(date: Date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const { postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId, published: true },
    include: {
      category: true,
      _count: { select: { comments: true, likes: true } },
    },
  });

  if (!post) notFound();

  return (
    <article className="lwt-pane">
      <header className="lwt-post-header">
        <div className="lwt-post-cat">{post.category.name}</div>
        <h1 className="lwt-post-title">{post.title}</h1>
        <div className="lwt-post-meta">
          <span>By Tone</span>
          <span className="lwt-post-meta-dot" />
          <span>{fmtDate(post.createdAt)}</span>
        </div>
      </header>

      {post.imageUrl && (
        <div className="lwt-post-cover">
          <img src={post.imageUrl} alt={post.title} />
        </div>
      )}

      <div className="lwt-post-body">{post.body}</div>

      <div className="lwt-actions">
        <LikeButton postId={post.id} />
        <div className="lwt-action-meta">
          {post._count.comments}{" "}
          {post._count.comments === 1 ? "comment" : "comments"}
        </div>
        <div className="lwt-action-spacer" />
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
