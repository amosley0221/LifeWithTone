import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Technology", slug: "technology" },
  { name: "Music", slug: "music" },
  { name: "Traveling", slug: "traveling" },
  { name: "Cars", slug: "cars" },
  { name: "Sports", slug: "sports" },
  { name: "Video Games", slug: "video-games" },
  { name: "Photography", slug: "photography" },
  { name: "Daily Life", slug: "daily-life" },
];

async function main() {
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Seeded categories:", categories.map((c) => c.name).join(", "));

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", bio: "", profileImage: null },
  });
  console.log("Seeded site settings.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
