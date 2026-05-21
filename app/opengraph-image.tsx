import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "David's Temple App - Ask. Find. Stay connected.";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 14% 18%, rgba(255,255,255,0.2), transparent 260px), linear-gradient(135deg, #002F5F 0%, #0A3B72 48%, #001F3F 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.055)",
            fontSize: 420,
            fontWeight: 800,
            lineHeight: 1,
            position: "absolute",
            right: -28,
            top: 82,
          }}
        >
          +
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 34,
            maxWidth: 690,
            zIndex: 1,
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              gap: 24,
            }}
          >
            <div
              style={{
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 28,
                display: "flex",
                height: 118,
                justifyContent: "center",
                overflow: "hidden",
                width: 168,
              }}
            >
              <img
                alt="David's Temple logo"
                src={new URL("../public/davids-temple-logo-white.png", import.meta.url).toString()}
                style={{
                  height: 108,
                  objectFit: "contain",
                  width: 108,
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontSize: 34, fontWeight: 800 }}>
                David&apos;s Temple App
              </div>
              <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 24 }}>
                davidstemple.app
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <div
              style={{
                fontSize: 86,
                fontWeight: 850,
                letterSpacing: -2,
                lineHeight: 0.96,
              }}
            >
              Ask. Find.
              <br />
              Stay connected.
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.84)",
                fontSize: 30,
                lineHeight: 1.32,
                maxWidth: 650,
              }}
            >
              A simple digital hub for David&apos;s Temple members, visitors, and
              ministry leaders.
            </div>
          </div>
        </div>

        <div
          style={{
            alignItems: "stretch",
            background: "rgba(255,255,255,0.94)",
            borderRadius: 34,
            boxShadow: "0 28px 90px rgba(0, 0, 0, 0.24)",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            overflow: "hidden",
            width: 360,
            zIndex: 1,
          }}
        >
          <div
            style={{
              background: "#8A001F",
              color: "white",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "28px 30px",
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800 }}>ask.dt</div>
            <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 18 }}>
              Church information assistant
            </div>
          </div>
          <div
            style={{
              color: "#0F172A",
              display: "flex",
              flexDirection: "column",
              gap: 22,
              padding: "30px",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 750, lineHeight: 1.25 }}>
              Service times, events, serving, care, giving, and connection.
            </div>
            <div
              style={{
                background: "#F6F8FB",
                border: "1px solid #E5E7EB",
                borderRadius: 999,
                color: "#64748B",
                fontSize: 18,
                padding: "16px 20px",
              }}
            >
              Ask a question
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
