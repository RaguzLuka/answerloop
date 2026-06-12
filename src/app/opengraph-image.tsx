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
          background: "linear-gradient(135deg, #050c1e 0%, #0a1838 60%, #0d2356 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#3b82f6",
              boxShadow: "0 0 24px #3b82f6",
            }}
          />
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "white", letterSpacing: -1 }}>
            Ring<span style={{ color: "#60a5fa" }}>Loop</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            letterSpacing: -2,
            marginBottom: 36,
          }}
        >
          <span>Your clinic misses calls.</span>
          <span style={{ color: "#60a5fa" }}>RingLoop answers them.</span>
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#94a3b8", marginBottom: 56 }}>
          AI receptionist that answers every call and books appointments by voice — 24/7.
        </div>

        <div style={{ display: "flex", gap: 36, fontSize: 24, color: "#cbd5e1" }}>
          <span>Tailored pricing</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>No contract</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>Setup in 24h</span>
          <span style={{ color: "#475569" }}>·</span>
          <span>ringloop.net</span>
        </div>
      </div>
    ),
    size
  );
}
