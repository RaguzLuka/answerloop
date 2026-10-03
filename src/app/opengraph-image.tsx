import { ImageResponse } from "next/og";

export const alt = "RingLoop — Turn missed calls into booked customers, by text";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function Bubble({ side, children }: { side: "in" | "out"; children: string }) {
  const incoming = side === "in";
  return (
    <div style={{ display: "flex", justifyContent: incoming ? "flex-start" : "flex-end", width: "100%" }}>
      <div
        style={{
          display: "flex",
          maxWidth: 330,
          padding: "14px 20px",
          fontSize: 22,
          lineHeight: 1.35,
          borderRadius: 26,
          borderBottomLeftRadius: incoming ? 8 : 26,
          borderBottomRightRadius: incoming ? 26 : 8,
          background: incoming ? "#eef1f6" : "#2156e8",
          color: incoming ? "#0c1b38" : "#ffffff",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          background:
            "radial-gradient(ellipse 70% 70% at 80% 10%, rgba(64,116,245,0.45), transparent 70%), #081530",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: brand + message */}
        <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 44 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(180deg, #3a6cf2, #1741c9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 9999, background: "white" }} />
              <div style={{ width: 8, height: 8, borderRadius: 9999, background: "white" }} />
              <div style={{ width: 8, height: 8, borderRadius: 9999, background: "white" }} />
            </div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: "white", letterSpacing: -1 }}>
              Ring<span style={{ color: "#7fa6f8" }}>Loop</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 66,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.06,
              letterSpacing: -2,
            }}
          >
            <span>Turn missed calls into</span>
            <span style={{ color: "#7fa6f8" }}>booked customers.</span>
          </div>

          <div style={{ display: "flex", fontSize: 26, color: "#9fb2d8", marginTop: 30, lineHeight: 1.4 }}>
            Missed-call text-back, AI booking by SMS and reminders — for salons, restaurants, clinics &amp; more.
          </div>

          <div style={{ display: "flex", gap: 28, fontSize: 22, color: "#c6d4ef", marginTop: 40 }}>
            <span>Keep your number</span>
            <span style={{ color: "#41538a" }}>·</span>
            <span>Live in 24h</span>
            <span style={{ color: "#41538a" }}>·</span>
            <span>ringloop.net</span>
          </div>
        </div>

        {/* Right: a text thread */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: 400,
            padding: 26,
            borderRadius: 36,
            background: "white",
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", fontSize: 17, color: "#ef4444", marginBottom: 4 }}>
            Missed call · 18:41
          </div>
          <Bubble side="in">Sorry we missed your call! Want to book? Just reply here.</Bubble>
          <Bubble side="out">Yes — a haircut on Friday?</Bubble>
          <Bubble side="in">Booked: Fri 14:30. See you then!</Bubble>
        </div>
      </div>
    ),
    size
  );
}
