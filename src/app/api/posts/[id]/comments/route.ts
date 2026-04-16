import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { author, body: commentBody } = body;

  if (!author?.trim() || !commentBody?.trim()) {
    return NextResponse.json(
      { error: "Author and body are required" },
      { status: 400 }
    );
  }

  // Sanitize inputs
  const sanitizedAuthor = author.trim().substring(0, 100);
  const sanitizedBody = commentBody.trim().substring(0, 2000);

  const comment = await prisma.comment.create({
    data: {
      author: sanitizedAuthor,
      body: sanitizedBody,
      postId: id,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
