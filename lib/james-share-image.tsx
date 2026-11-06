import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const jamesShareImageSize = { width: 1200, height: 630 };

type ShareImageOptions = {
  eyebrow: string;
  title: string;
  passage?: string;
  date?: string;
};

export async function renderJamesShareImage({ eyebrow, title, passage, date }: ShareImageOptions) {
  const logo = await readFile(
    join(process.cwd(), "public/bible-studies/journey-through-james/dt-logo-white.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #002f5f 0%, #001f3f 100%)",
          color: "white",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -30,
            bottom: -110,
            fontSize: 360,
            fontWeight: 700,
            color: "rgba(255,255,255,0.05)",
            letterSpacing: -10,
          }}
        >
          James
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 12,
            background: "linear-gradient(90deg, #8a001f 0%, #c4405f 55%, rgba(196,64,95,0) 100%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#f2c4cf",
            }}
          >
            {eyebrow}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={172} height={80} alt="" />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            {title}
          </div>
          {passage ? (
            <div style={{ display: "flex", marginTop: 22, fontSize: 34, color: "#f2c4cf" }}>{passage}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 8 }}>
          {date ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 26px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 20, letterSpacing: 3, textTransform: "uppercase" }}>
                Study date
              </span>
              <span>{date}</span>
            </div>
          ) : (
            <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.7)" }}>
              Builders Sunday School Class · davidstemple.app
            </div>
          )}
        </div>
      </div>
    ),
    jamesShareImageSize,
  );
}
