import { ImageResponse } from "next/og";

export const alt =
  "Isanjalee Silva — Software Engineer and AI Researcher portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 18% 18%, #43331a 0, #11100e 36%, #050505 78%)",
          color: "#f5ece1",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(251,191,36,0.42)",
            borderRadius: "40px",
            boxShadow: "0 28px 90px rgba(0,0,0,0.44)",
            display: "flex",
            flexDirection: "column",
            padding: "64px 72px",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#fbbf24",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 7,
              textTransform: "uppercase",
            }}
          >
            Official Portfolio
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: -4,
              marginTop: 24,
            }}
          >
            Isanjalee Silva
          </div>
          <div
            style={{
              color: "rgba(245,236,225,0.76)",
              display: "flex",
              fontSize: 32,
              marginTop: 18,
            }}
          >
            Software Engineer · Full-Stack Developer · AI Researcher
          </div>
          <div
            style={{
              color: "#14f1c4",
              display: "flex",
              fontSize: 23,
              fontWeight: 700,
              marginTop: 50,
            }}
          >
            www.isanjalee.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
