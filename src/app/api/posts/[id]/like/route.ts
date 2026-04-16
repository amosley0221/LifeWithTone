import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const fingerprint = req.nextUrl.searchParams.get("fingerprint") || "";

  const count = await prisma.like.count({ where: { postId: id } });

  let liked = false;
  if (fingerprint) {
    const existing = await prisma.like.findUnique({
      where: { fingerprint_postId: { fingerprint, postId: id } },
    });
    liked = !!existing;
  }

  return NextResponse.json({ count, liked });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { fingerprint } = body;

  if (!fingerprint) {
    return NextResponse.json(
      { error: "Fingerprint required" },
      { status: 400 }
    );
  }

  const existing = await prisma.like.findUnique({
    where: { fingerprint_postId: { fingerprint, postId: id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { fingerprint, postId: id },
    });
  }

  const count = await prisma.like.count({ where: { postId: id } });
  const liked = !existing;

  return NextResponse.json({ count, liked });
}
