"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface SidebarPost {
  id: string;
  title: string;
  createdAt: string;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function PostSidebar({
  posts,
  basePath,
  sectionLabel,
}: {
  posts: SidebarPost[];
  basePath: string;
  sectionLabel: string;
}) {
  const params = useParams();
  const activePostId = params?.postId as string | undefined;

  return (
    <aside className="lwt-rail">
      <div className="lwt-rail-head">
        <div className="lwt-rail-eyebrow">Section</div>
        <h2 className="lwt-rail-title">{sectionLabel}</h2>
        <div className="lwt-rail-count">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
        </div>
      </div>
      <div className="lwt-rail-list">
        {posts.length === 0 ? (
          <div className="lwt-rail-empty">Nothing here yet.</div>
        ) : (
          posts.map((p) => {
            const active = activePostId === p.id;
            return (
              <Link
                key={p.id}
                href={`${basePath}/${p.id}`}
                className={`lwt-rail-item${active ? " active" : ""}`}
                data-cursor-label="Read"
              >
                <h3 className="lwt-rail-item-title">{p.title}</h3>
                <div className="lwt-rail-item-meta">
                  <span>{fmtDate(p.createdAt)}</span>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
