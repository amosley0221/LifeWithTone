import { renderLwTIcon } from "@/lib/iconRender";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return renderLwTIcon(size.width, size.height);
}
