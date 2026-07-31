import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Data-driven: one template, any repo/niche ───
export type ShortData = {
  hook: string;
  hookSub: string;
  bg1: string;
  rows: { label: string; value: string }[];
  rowsBg: string;
  cta: string;
  ctaSub: string;
  bg3: string;
};

export const AGENT_REACH_SHORT: ShortData = {
  hook: "👁️ Agent-Reach",
  hookSub: "One-click internet for AI agents",
  bg1: "#7c3aed",
  rows: [
    { label: "15+ platforms", value: "1 command" },
    { label: "Auto-fallback", value: "6/9 ready" },
    { label: "MIT · Free", value: "0 cost" },
  ],
  rowsBg: "#1e1b4b",
  cta: "Give your Agent the internet",
  ctaSub: "github.com/Panniantong/Agent-Reach",
  bg3: "#db2777",
};

// ─── Scene 1: Hook ───
const Scene1: React.FC<{ d: ShortData }> = ({ d }) => {
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
        backgroundColor: d.bg1,
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
        {d.hook}
      </div>
      <div
        style={{
          opacity,
          marginTop: 30,
          fontSize: 30,
          color: "#ddd6fe",
          fontWeight: 500,
        }}
      >
        {d.hookSub}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Data rows ───
const Scene2: React.FC<{ d: ShortData }> = ({ d }) => {
  const frame = useCurrentFrame();
  const delay = 10;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: d.rowsBg,
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 36 }}>
        Why it wins
      </div>
      {d.rows.map((r, i) => {
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
              background: "#312e81",
              borderRadius: 14,
              padding: "18px 26px",
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 34, fontWeight: 700, color: "#e0e7ff" }}>
              {r.label}
            </span>
            <span style={{ fontSize: 38, fontWeight: 800, color: "#fbbf24" }}>
              {r.value}
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
          color: "#a5b4fc",
          textAlign: "center",
        }}
      >
        Backends come and go — you won't notice ✓
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: CTA ───
const Scene3: React.FC<{ d: ShortData }> = ({ d }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 12], [0.6, 1], {
    extrapolateRight: "clamp",
  });
  const pulse = Math.sin(frame / 12) * 0.03 + 1;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: d.bg3,
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
        {d.cta}
      </div>
      <div
        style={{
          transform: `scale(${pulse})`,
          marginTop: 30,
          background: "#fbbf24",
          color: "#1a1a2e",
          fontSize: 30,
          fontWeight: 800,
          padding: "16px 36px",
          borderRadius: 50,
        }}
      >
        {d.ctaSub}
      </div>
    </AbsoluteFill>
  );
};

// ─── Main: data-driven composition ───
export const DataShorts: React.FC<{ data?: ShortData }> = ({ data }) => {
  const d = data ?? AGENT_REACH_SHORT;
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: "system-ui, sans-serif" }}>
      <Sequence durationInFrames={Math.round(fps * 4)}>
        <Scene1 d={d} />
      </Sequence>
      <Sequence from={Math.round(fps * 4)} durationInFrames={Math.round(fps * 8)}>
        <Scene2 d={d} />
      </Sequence>
      <Sequence
        from={Math.round(fps * 12)}
        durationInFrames={durationInFrames - Math.round(fps * 12)}
      >
        <Scene3 d={d} />
      </Sequence>
    </AbsoluteFill>
  );
};
