import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: { id: "singleton", bio: "", profileImage: null },
    });
  }

  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { bio, profileImage } = body;

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...(bio !== undefined && { bio }),
      ...(profileImage !== undefined && { profileImage }),
    },
    create: {
      id: "singleton",
      bio: bio || "",
      profileImage: profileImage || null,
    },
  });

  return NextResponse.json(settings);
}
