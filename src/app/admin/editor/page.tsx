"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { FaUpload } from "react-icons/fa";

export default function NewPostPage() {
  const { status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      })
      .catch(() => {});
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setImageUrl(data.url);
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) return;

    setSubmitting(true);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        categoryId,
        imageUrl: imageUrl || null,
        published,
      }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    }
    setSubmitting(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-8">New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-primary focus:outline-none focus:border-accent"
            placeholder="Post title..."
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-text-primary focus:outline-none focus:border-accent"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Cover image */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Cover Image
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors">
              <FaUpload size={12} />
              {uploading ? "Uploading..." : "Choose Image"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
            {imageUrl && (
              <div className="flex items-center gap-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="h-10 w-10 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-xs text-danger hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm text-text-secondary mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={16}
            className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-md text-sm text-text-primary focus:outline-none focus:border-accent resize-y font-mono"
            placeholder="Write your post..."
            required
          />
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-border rounded-full peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
          </label>
          <span className="text-sm text-text-secondary">
            {published ? "Published" : "Draft"}
          </span>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-6 py-2 border border-border text-text-secondary text-sm rounded-md hover:bg-bg-tertiary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
