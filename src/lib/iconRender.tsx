import { ImageResponse } from "next/og";

const FONT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15";

async function loadCormorant(italic: boolean): Promise<ArrayBuffer> {
  const ital = italic ? "1" : "0";
  const cssUrl = `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@${ital},500&text=${encodeURIComponent(
    "LwT"
  )}`;
  const css = await fetch(cssUrl, {
    headers: { "User-Agent": FONT_USER_AGENT },
  }).then((r) => r.text());
  const fontUrl = css.match(/src:\s*url\((.+?)\)\s*format/)?.[1];
  if (!fontUrl) throw new Error("Cormorant font URL not found");
  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export async function renderLwTIcon(width: number, height: number) {
  const [regular, italicFont] = await Promise.all([
    loadCormorant(false),
    loadCormorant(true),
  ]);

  const fontSize = Math.round(height * 0.62);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3eedf",
          color: "#1f3a2a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Cormorant",
          fontSize,
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        <span>L</span>
        <span
          style={{
            color: "#007a33",
            fontStyle: "italic",
            padding: "0 0.04em",
          }}
        >
          w
        </span>
        <span>T</span>
      </div>
    ),
    {
      width,
      height,
      fonts: [
        { name: "Cormorant", data: regular, style: "normal", weight: 500 },
        { name: "Cormorant", data: italicFont, style: "italic", weight: 500 },
      ],
    }
  );
}
