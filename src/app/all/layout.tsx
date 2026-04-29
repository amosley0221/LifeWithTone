import { prisma } from "@/lib/prisma";
import PostSidebar from "@/components/PostSidebar";

export const dynamic = "force-dynamic";

export const metadata = { title: "All Writing | LifeWithTone" };

export default async function AllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true },
  });

  const sidebarPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div className="lwt-reader">
      <PostSidebar
        posts={sidebarPosts}
        basePath="/all"
        sectionLabel="All Writing"
      />
      {children}
    </div>
  );
}
