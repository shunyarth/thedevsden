import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = `${site.brand} — ${site.name}, ${site.title} in ${site.city}, India`;

// The 1200×630 preview picture shown when your link is shared on WhatsApp, LinkedIn, X, Facebook…
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          backgroundColor: "#0a0806",
          backgroundImage:
            "radial-gradient(circle at 78% 50%, rgba(245,158,11,0.28), transparent 45%), radial-gradient(circle at 10% 0%, rgba(251,191,36,0.14), transparent 40%)",
          color: "#faf5eb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#fbbf24", letterSpacing: 6, textTransform: "uppercase" }}>
            {site.name} · {site.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 800,
              lineHeight: 1,
              marginTop: 18,
              backgroundImage: "linear-gradient(100deg, #fff7e6 0%, #fde68a 35%, #fbbf24 65%, #f59e0b 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {site.brand}
          </div>
          <div style={{ display: "flex", fontSize: 34, color: "#b8ab93", marginTop: 28, lineHeight: 1.35 }}>
            Websites, web apps & e-commerce stores — {site.city}, India
          </div>
        </div>

        {/* Black hole mark */}
        <div style={{ display: "flex", position: "relative", width: 360, height: 360, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "absolute",
              width: 360,
              height: 110,
              borderRadius: "50%",
              border: "10px solid #f59e0b",
              boxShadow: "0 0 40px rgba(251,191,36,0.6)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 190,
              height: 190,
              borderRadius: "50%",
              backgroundColor: "#000",
              border: "5px solid #fde68a",
              boxShadow: "0 0 50px 12px rgba(251,191,36,0.55)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 196,
              width: 330,
              height: 44,
              borderBottomLeftRadius: 165,
              borderBottomRightRadius: 165,
              borderBottom: "10px solid #fbbf24",
            }}
          />
        </div>
      </div>
    ),
    ogSize,
  );
}
