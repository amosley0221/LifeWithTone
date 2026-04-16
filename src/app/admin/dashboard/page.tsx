"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";

interface Post {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
  category: { name: string; slug: string };
  _count: { comments: number; likes: number };
}

interface SiteSettings {
  bio: string;
  profileImage: string | null;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile state
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
      fetchSettings();
    }
  }, [status]);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts?all=true");
    if (res.ok) {
      setPosts(await res.json());
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data: SiteSettings = await res.json();
      setBio(data.bio);
      setProfileImage(data.profileImage);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((p) => p.filter((post) => post.id !== id));
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    if (res.ok) {
      setPosts((p) =>
        p.map((post) =>
          post.id === id ? { ...post, published: !published } : post
        )
      );
    }
  };

  const handleProfileImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setProfileImage(data.url);
    }
    setUploadingProfile(false);
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileSaved(false);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio, profileImage }),
    });

    if (res.ok) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
    setSavingProfile(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-8">Dashboard</h1>

      {/* Profile / About Me section */}
      <section className="mb-10 bg-bg-card border border-border rounded-lg p-6">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
          About Me
        </h2>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Profile image */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            {profileImage ? (
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-28 h-28 rounded-full bg-bg-tertiary border-2 border-border flex items-center justify-center">
                <span className="text-3xl text-text-muted">T</span>
              </div>
            )}
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-tertiary border border-border rounded-md text-xs text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors">
              <FaUpload size={10} />
              {uploadingProfile ? "Uploading..." : "Change Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                disabled={uploadingProfile}
              />
            </label>
            {profileImage && (
              <button
                type="button"
                onClick={() => setProfileImage(null)}
                className="text-xs text-danger hover:text-red-400"
              >
                Remove
              </button>
            )}
          </div>

          {/* Bio */}
          <div className="flex-1">
            <label className="block text-sm text-text-secondary mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell visitors about yourself..."
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-y"
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="px-4 py-1.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>
              {profileSaved && (
                <span className="text-xs text-success">Saved!</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Posts section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Posts
          </h2>
          <Link
            href="/admin/editor"
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors"
          >
            <FaPlus size={12} />
            New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted mb-4">No posts yet.</p>
            <Link
              href="/admin/editor"
              className="text-accent hover:text-accent-hover text-sm"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between bg-bg-card border border-border rounded-lg px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {post.title}
                    </h3>
                    <span
                      className={`shrink-0 px-2 py-0.5 text-xs rounded-full ${
                        post.published
                          ? "bg-success/15 text-success"
                          : "bg-text-muted/15 text-text-muted"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                    <span>{post.category.name}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span>{post._count.likes} likes</span>
                    <span>{post._count.comments} comments</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => togglePublish(post.id, post.published)}
                    className="px-3 py-1 text-xs border border-border rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors"
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </button>
                  <Link
                    href={`/admin/editor/${post.id}`}
                    className="p-2 text-text-muted hover:text-accent transition-colors"
                  >
                    <FaEdit size={14} />
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 text-text-muted hover:text-danger transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
