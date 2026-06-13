import { ImageResponse } from "next/og";

export const alt = "RingLoop — AI voice receptionist for medical clinics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(64,116,245,0.35), transparent 70%), #081530",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#2156e8",
              boxShadow: "0 0 24px #2156e8",
            }}
          />
          <div style={{ display: "flex", fontSize: 40, color: "white", letterSpacing: -1 }}>
            Ring<span style={{ color: "#7fa6f8", fontStyle: "italic" }}>Loop</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 78,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 36,
          }}
        >
          <span>Your clinic misses calls.</span>
          <span style={{ color: "#7fa6f8", fontStyle: "italic" }}>RingLoop answers them.</span>
        </div>

        <div style={{ display: "flex", fontSize: 29, color: "#9fb2d8", marginBottom: 56, fontFamily: "sans-serif" }}>
          The AI receptionist that answers every call and books appointments by voice — 24/7.
        </div>

        <div style={{ display: "flex", gap: 36, fontSize: 24, color: "#c6d4ef", fontFamily: "sans-serif" }}>
          <span>Tailored pricing</span>
          <span style={{ color: "#41538a" }}>·</span>
          <span>No contract</span>
          <span style={{ color: "#41538a" }}>·</span>
          <span>Setup in 24h</span>
          <span style={{ color: "#41538a" }}>·</span>
          <span>ringloop.net</span>
        </div>
      </div>
    ),
    size
  );
}
