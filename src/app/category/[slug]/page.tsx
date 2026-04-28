import { CATEGORIES } from "@/lib/constants";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);

  return (
    <div className="lwt-empty-pane">
      <h2>{cat?.name ?? "Section"}</h2>
      <p>Pick a post from the rail to start reading.</p>
    </div>
  );
}
