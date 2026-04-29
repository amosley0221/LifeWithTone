import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LifeWithTone",
    short_name: "LwT",
    description:
      "Notes from the road, the garage, the record shelf, and the quiet hours in between.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3eedf",
    theme_color: "#1f3a2a",
    icons: [
      {
        src: "/icon",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
