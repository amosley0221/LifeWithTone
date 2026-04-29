import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  const tagline =
    settings?.bio?.trim() ||
    "Notes from the road, the garage, the record shelf, and the quiet hours in between.";

  return (
    <main className="lwt-home">
      <div className="lwt-home-eyebrow">Est. 2026 — A personal journal</div>
      <h1 className="lwt-home-title">
        Life <em>with</em> Tone
      </h1>
      <p className="lwt-home-tagline">{tagline}</p>
      <div className="lwt-home-meta">
        <span className="lwt-home-meta-rule" />
        <Link
          href="/all"
          className="lwt-home-cta"
          data-cursor-label="Browse"
        >
          Browse all writing
        </Link>
        <span className="lwt-home-meta-rule" />
      </div>
    </main>
  );
}
