import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Scene 1: Hook — the ₹78,000 question ───
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 25], [0.9, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b8a8a",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 62,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.3,
        }}
      >
        ☀️ Solar Lagao
        <br />
        <span style={{ color: "#fbbf24" }}>₹78,000</span> Subsidy Pao
      </div>
      <div
        style={{
          opacity,
          marginTop: 30,
          fontSize: 30,
          color: "#ccfbf1",
          fontWeight: 500,
        }}
      >
        PM Surya Ghar Yojana
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: The numbers ───
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const delay = 10;
  const rows = [
    { size: "1 kW", sub: "₹30,000" },
    { size: "2 kW", sub: "₹60,000" },
    { size: "3 kW+", sub: "₹78,000 CAP" },
  ];
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f172a",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 36 }}>
        Subsidy Breakdown
      </div>
      {rows.map((r, i) => {
        const o = interpolate(frame - delay - i * 8, [0, 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              opacity: o,
              transform: `translateX(${(1 - o) * 40}px)`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#1e293b",
              borderRadius: 14,
              padding: "18px 26px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 34, fontWeight: 700, color: "#e2e8f0" }}>
              {r.size}
            </span>
            <span style={{ fontSize: 38, fontWeight: 800, color: "#fbbf24" }}>
              {r.sub}
            </span>
          </div>
        );
      })}
      <div
        style={{
          opacity: interpolate(frame - delay - 40, [0, 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          marginTop: 18,
          fontSize: 26,
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Govt directly credits your bank account ✓
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: CTA ───
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 12], [0.6, 1], {
    extrapolateRight: "clamp",
  });
  const pulse = Math.sin(frame / 12) * 0.03 + 1;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#d8108c",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          transform: `scale(${pop})`,
          fontSize: 52,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.35,
        }}
      >
        Kaun Sa Installer Best Hai?
      </div>
      <div
        style={{
          transform: `scale(${pulse})`,
          marginTop: 30,
          background: "#fbbf24",
          color: "#1a1a2e",
          fontSize: 34,
          fontWeight: 800,
          padding: "16px 40px",
          borderRadius: 50,
        }}
      >
        Compare Now →
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 26,
          color: "#fce7f3",
          fontWeight: 500,
        }}
      >
        Link in bio
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ───
export const SolarShorts: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sequence durationInFrames={Math.round(fps * 4)}>
        <Scene1 />
      </Sequence>
      <Sequence from={Math.round(fps * 4)} durationInFrames={Math.round(fps * 8)}>
        <Scene2 />
      </Sequence>
      <Sequence
        from={Math.round(fps * 12)}
        durationInFrames={durationInFrames - Math.round(fps * 12)}
      >
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return <SolarShorts />;
};
