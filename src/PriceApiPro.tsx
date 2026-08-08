import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AnimatedGradient,
  FilmGrain,
  Scanlines,
  Vignette,
  ParticleField,
  useBoil,
  useChipReveal,
  usePulse,
  EASINGS,
  CLAMP,
} from "./motionKit";

/* ────────────────────────────────────────────────────────────────
   "GPU Price API" short — Live price in one line of code.
   Choreography: terminal type-in → request/data-flow hubs → rolling
   price ticker → compare tie-in → pulsing CTA. No hard cuts
   (AbsoluteFill scenes drawn between moving backgrounds; all layers
   keep drifting so no frame is dead).
   ──────────────────────────────────────────────────────────────── */

const FPS = 30;
const TOTAL = 30 * 30; // 30s

/* Terminal scene — type the request char-by-char with a blinking cursor. */
const TerminalHook: React.FC = () => {
  const frame = useCurrentFrame();
  const prompt = "GET /v1/prices?gpu=h100";
  const chars = Math.min(prompt.length, Math.floor(frame / 2.2));
  const cursorBlink = Math.floor(frame / 9) % 2 === 0;
  const typed = prompt.slice(0, chars);

  const glowEl = interpolate(frame, [0, 30], [1.0, 1.4], CLAMP);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", padding: 50, backgroundColor: "#070b14" }}
    >
      <AnimatedGradient base="#070b14" c1="#06b6d4" c2="#3b82f6" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "rgba(4,8,16,0.82)",
            border: "1.5px solid rgba(34,211,238,0.35)",
            borderRadius: 18,
            padding: "34px 30px",
            fontFamily: "'SF Mono', 'Courier New', monospace",
            fontSize: 34,
            lineHeight: 1.55,
            color: "#7dd3fc",
            boxShadow: `0 0 ${glowEl * 24}px rgba(34,211,238,0.28)`,
          }}
        >
          <div style={{ color: "#22d3ee", fontWeight: 700 }}>$ gpuprice</div>
          <div style={{ minHeight: 52, marginTop: 8 }}>
            {typed}
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 34,
                marginLeft: 4,
                verticalAlign: "middle",
                background: cursorBlink ? "#22d3ee" : "transparent",
                boxShadow: cursorBlink ? "0 0 12px #22d3ee" : "none",
              }}
            />
          </div>
          <div style={{ color: "#34d399", fontSize: 26, marginTop: 10, opacity: 0.85 }}>
            {"// GPUIndia · live on-demand pricing API"}
          </div>
        </div>

        {/* Side label pops in with the 1-line pitch */}
        <div
          style={{
            transform: `translateY(${(1 - EASINGS.out(interpolate(frame, [26, 42], [0, 1], CLAMP))) * 30}px)`,
            opacity: interpolate(frame, [26, 42], [0, 1], CLAMP),
            marginTop: 30,
            textAlign: "center",
            fontSize: 40,
            fontWeight: 900,
            color: "#fff",
          }}
        >
          Rent a GPU?{" "}
          <span style={{ color: "#2dd4bf" }}>Stop guessing.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Request travelling into the API hub, JSON echoing back. */
const ApiFlow: React.FC = () => {
  const frame = useCurrentFrame();

  // request dot travels along a path
  const dotT = interpolate(frame, [0, 34], [0, 1], CLAMP);
  const dotX = interpolate(dotT, [0, 1], [15, 38]); // %
  const dotY = interpolate(dotT, [0, 1], [34, 32]); // %

  // hub spins in
  const hubScale = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 70 } });
  const hubRot = interpolate(frame, [0, 50], [0, 9], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // response lines come back
  const jsonLines: Array<[string, string]> = [
    ['"gpu": "H100 SXM"', "#7dd3fc"],
    ['"ondemand": "⚡ $2.50/hr"', "#fbbf24"],
    ['"inr": "≈ ₹208/hr"', "#34d399"],
  ];

  // prices float up; sublabel appears
  const subO = interpolate(frame, [40, 54], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 46, backgroundColor: "#08110f" }}>
      <AnimatedGradient base="#08110f" c1="#10b981" c2="#047857" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, padding: 46 }}>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#ccfbf1", marginBottom: 30, textAlign: "center" }}>
          One call. Live price.
          <div style={{ fontSize: 26, color: "#5eead4", fontWeight: 500, marginTop: 8 }}>
            real-time on-demand rates · USD &amp; INR
          </div>
        </div>

        {/* request dot path */}
        <svg viewBox="0 0 100 70" style={{ width: "100%", marginTop: 6 }}>
          <line x1="12" y1="34" x2="42" y2="34" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="42" y1="34" x2="58" y2="40" stroke="#38bdf8" strokeWidth="2" />
          <line x1="58" y1="40" x2="82" y2="40" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" opacity={interpolate(frame, [30, 48], [0, 1], CLAMP)} />
          <circle cx={`${dotX}`} cy={`${dotY}`} r="4" fill="#fbbf24">
            <animate attributeName="r" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
          </circle>
          {/* api hub */}
          <g
            transform={`translate(58 40) rotate(${hubRot * (1 - hubScale)} 0 0)`}
            style={{ opacity: hubScale }}
          >
            <circle cx="0" cy="0" r="12" fill="none" stroke="#22d3ee" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="5" fill="#22d3ee" />
            <text x="0" y="-16" fill="#22d3ee" textAnchor="middle" fontSize="7" fontWeight="800">API</text>
          </g>
        </svg>

        {/* response JSON card */}
        <div
          style={{
            marginTop: 26,
            background: "rgba(2,10,8,0.85)",
            border: "1.5px solid rgba(52,211,153,0.4)",
            borderRadius: 16,
            padding: "24px 26px",
            fontFamily: "'SF Mono', 'Courier New', monospace",
            fontSize: 30,
          }}
        >
          <div style={{ color: "#5eead4", marginBottom: 10 }}>{"{"}</div>
          {jsonLines.map(([k, c], i) => {
            const o = interpolate(frame - 34 - i * 7, [0, 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div key={k} style={{ opacity: o, transform: `translateY(${(1 - o) * 14}px)`, color: c, paddingLeft: 22 }}>
                {k}
                {i < jsonLines.length - 1 ? "," : ""}
              </div>
            );
          })}
        </div>

        {/* usage note */}
        <div style={{ opacity: subO, textAlign: "center", marginTop: 24, color: "#99f6e4", fontSize: 26, fontWeight: 500 }}>
          `GET /v1/prices?gpu=h100` → live price
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* Live price ticker — digits roll like a scoreboard. */
const Ticker: React.FC = () => {
  const frame = useCurrentFrame();
  const gpcs = [
    { g: "H100", usd: "$2.50", inr: "₹208" },
    { g: "H200", usd: "$2.80", inr: "₹232" },
    { g: "A100", usd: "$1.67", inr: "₹139" },
    { g: "B200", usd: "$4.50", inr: "₹374" },
    { g: "RTX 5090", usd: "$0.58", inr: "₹48" },
  ];
  const rows = useStagger(frame, gpcs.length);
  const tickGlow = Math.sin(frame / 6) * 0.15 + 0.85;

  return (
    <AbsoluteFill style={{ justifyContent: "center", padding: 46, backgroundColor: "#0a0f1e" }}>
      <AnimatedGradient base="#0a0f1e" c1="#8b5cf6" c2="#6d28d9" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, padding: 46 }}>
        <div
          style={{
            fontSize: 42,
            fontWeight: 900,
            color: "#fff",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          Live today <span style={{ color: "#22d3ee" }}>(India ₹)</span>
          <div style={{ fontSize: 24, color: "#94a3b8", fontWeight: 500, marginTop: 6 }}>
            cheapest on-demand · updates daily
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          {gpcs.map((row, i) => {
            const s = rows(i);
            return (
              <div
                key={row.g}
                style={{
                  transform: `scale(${s.scale})`,
                  opacity: s.opacity,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "rgba(15,23,42,0.85)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  borderRadius: 14,
                  padding: "16px 24px",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 32, fontWeight: 800, color: "#e2e8f0" }}>{row.g}</span>
                <span style={{ display: "flex", gap: 14 }}>
                  <span
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: "#fbbf24",
                      boxShadow: `0 0 ${tickGlow * 14}px rgba(251,191,36,0.35)`,
                      padding: "2px 8px",
                      borderRadius: 6,
                    }}
                  >
                    {row.usd}
                  </span>
                  <span style={{ fontSize: 30, fontWeight: 800, color: "#34d399" }}>{row.inr}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const useStagger = (frame: number, n: number) => (i: number) =>
  useChipReveal(frame, 8 + i * 6);

/* Compare tie-in + CTA */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const chips = [
    { t: "GPU-vs-GPU Compare", icon: "⚖️" },
    { t: "TCO (rent vs buy)", icon: "🧮" },
    { t: "Electricity ₹ / state", icon: "⚡" },
  ];
  const pulse = usePulse(frame, 0.06, 0.04);
  const boil = useBoil(frame, 3);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 46, backgroundColor: "#0d0518", textAlign: "center" }}>
      <AnimatedGradient base="#0d0518" c1="#ec4899" c2="#7c3aed" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 46 }}>
        <div style={{ opacity: interpolate(frame, [0, 16], [0, 1], CLAMP), fontSize: 52, fontWeight: 900, color: "#fff", transform: `translateY(${(1 - EASINGS.out(interpolate(frame, [0, 16], [0, 1], CLAMP))) * 24}px)` }}>
          Got the price.
          <br />
          <span style={{ color: "#f472b6" }}>Now run it.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40, width: "100%", maxWidth: 640 }}>
          {chips.map((c, i) => {
            const s = useChipReveal(frame, 20 + i * 10);
            return (
              <div
                key={c.t}
                style={{
                  opacity: s.opacity,
                  transform: `scale(${s.scale})`,
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(244,114,182,0.4)",
                  borderRadius: 50,
                  padding: "18px 26px",
                  fontSize: 30,
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {c.icon} {c.t}
              </div>
            );
          })}
        </div>

        <div
          style={{
            transform: `scale(${pulse.scale})`,
            marginTop: 40,
            background: "linear-gradient(90deg,#0acf6e,#2dd4bf)",
            color: "#06131a",
            fontSize: 36,
            fontWeight: 900,
            padding: "18px 50px",
            borderRadius: 50,
            boxShadow: "0 0 40px rgba(10,207,110,0.5)",
          }}
        >
          gpuprice.in →
        </div>
        <div style={{ marginTop: 20, fontSize: 24, color: "#f3e8ff", fontWeight: 600, opacity: interpolate(frame, [30, 46], [0, 1], CLAMP) }}>
          Live prices. Honest tools. India-first.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const PriceApiShort: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  // cross-fade transitions between scenes (no hard cuts) + a 4s CTA hold.
  const scene1 = 120;
  const scene2 = 200;
  const scene3 = 290;
  const scene4 = durationInFrames - scene3 - 40;
  return (
    <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", backgroundColor: "#05070d" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={scene1}><TerminalHook /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
        <TransitionSeries.Sequence durationInFrames={scene2}><ApiFlow /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
        <TransitionSeries.Sequence durationInFrames={scene3}><Ticker /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 40 })} />
        <TransitionSeries.Sequence durationInFrames={scene4}><Cta /></TransitionSeries.Sequence>
      </TransitionSeries>
      <FilmGrain />
      <Scanlines />
      <Vignette />
      <ParticleField count={26} color="rgba(45,212,191,0.6)" />
    </AbsoluteFill>
  );
};
