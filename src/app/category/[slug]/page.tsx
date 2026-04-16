import { CATEGORIES } from "@/lib/constants";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {cat?.name || "Category"}
        </h1>
        <p className="text-text-muted text-sm">
          Select a post from the sidebar to start reading.
        </p>
      </div>
    </div>
  );
}
