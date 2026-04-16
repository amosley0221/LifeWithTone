import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostSidebar from "@/components/PostSidebar";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  return { title: cat ? `${cat.name} | LifeWithTone` : "LifeWithTone" };
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, createdAt: true },
      },
    },
  });

  if (!category) notFound();

  const sidebarPosts = category.posts.map((p) => ({
    id: p.id,
    title: p.title,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <PostSidebar posts={sidebarPosts} categorySlug={slug} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
