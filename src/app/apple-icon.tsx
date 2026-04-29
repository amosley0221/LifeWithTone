import { renderLwTIcon } from "@/lib/iconRender";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderLwTIcon(size.width, size.height);
}
