import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const all = searchParams.get("all");

  const session = await auth();
  const isAdmin = !!session?.user;

  const where: Record<string, unknown> = {};
  if (!isAdmin || !all) {
    where.published = true;
  }
  if (category) {
    where.category = { slug: category };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { comments: true, likes: true } },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, categoryId, imageUrl, published } = body;

  if (!title || !content || !categoryId) {
    return NextResponse.json(
      { error: "Title, content, and category are required" },
      { status: 400 }
    );
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);

  const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

  const post = await prisma.post.create({
    data: {
      title,
      slug: uniqueSlug,
      body: content,
      categoryId,
      imageUrl: imageUrl || null,
      published: published ?? false,
    },
    include: { category: true },
  });

  return NextResponse.json(post, { status: 201 });
}
