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
  useKineticStatement,
  EASINGS,
  CLAMP,
} from "./motionKit";

/* ────────────────────────────────────────────────────────────────
   "Wire Your AI to Bill in One Weekend" short.
   Choreography: AI-brain boot with skills stacking → weekend build
   timeline (Fri/Sat/Sun wiring) → money wiring count-up → wire-pulse CTA.
   Distinct film treatment from PriceApiShort: progress/circuit-trace
   + finance blueprint palette (amber boot / cyan build / emerald money
   / pink CTA). Every layer keeps drifting; transitions, not hard cuts.
   ──────────────────────────────────────────────────────────────── */

const FPS = 30;
const TOTAL = 30 * 30; // 30s

/* ── Scene 1 — Hook + AI brain boot, skills stacking ── */
const BrainBoot: React.FC = () => {
  const frame = useCurrentFrame();

  // Brain "core" spins up
  const coreScale = spring({ frame, fps: FPS, config: { damping: 11, stiffness: 64 } });
  const coreRot = interpolate(frame, [0, 60], [0, 18], { ...CLAMP, easing: Easing.out(Easing.cubic) });

  // Skills loader: the image's "9 Skills Loaded" — a progress ring fills 0→9
  const loaded = Math.min(9, Math.floor(frame / 8));
  const ringP = interpolate(frame, [0, 72], [0, 1], CLAMP);
  const C = 2 * Math.PI * 62;

  const hook = useKineticStatement(frame, 6);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0803", justifyContent: "center", padding: 46 }}>
      <AnimatedGradient base="#0d0803" c1="#f59e0b" c2="#b45309" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 46 }}>

        {/* Hook statement */}
        <div style={{ opacity: hook.lines, transform: `translateY(${(1 - hook.lines) * 26}px)`, textAlign: "center" }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", letterSpacing: 0.5 }}>
            Wire your AI
            <br />
            <span style={{ color: "#fbbf24" }}>to Bill.</span>
          </div>
          <div style={{ fontSize: 30, color: "#fcd34d", fontWeight: 600, marginTop: 14, opacity: interpolate(frame, [20, 32], [0, 1], CLAMP) }}>
            One weekend.
          </div>
        </div>

        {/* AI brain + skills ring */}
        <div style={{ position: "relative", width: 320, height: 320, marginTop: 50, transform: `rotate(${coreRot * (1 - coreScale)}deg)`, opacity: coreScale }}>
          {/* progress ring → 9 skills */}
          <svg viewBox="0 0 160 160" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <circle cx="80" cy="80" r="62" fill="none" stroke="rgba(251,191,36,0.18)" strokeWidth="7" />
            <circle
              cx="80" cy="80" r="62" fill="none"
              stroke="#fbbf24" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={`${ringP * C} ${C}`}
              transform="rotate(-90 80 80)"
            />
          </svg>
          {/* brain core */}
          <div style={{
            position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
            width: 104, height: 104, borderRadius: "50%", border: "3px solid rgba(251,191,36,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(20,12,2,0.85)", boxShadow: "0 0 46px rgba(251,191,36,0.35)",
          }}>
            <span style={{ fontSize: 52 }}>⚡</span>
          </div>
          {/* skills loaded label */}
          <div style={{
            position: "absolute", left: "50%", bottom: -6, transform: "translateX(-50%)",
            background: "rgba(4,8,16,0.9)", border: "1px solid rgba(251,191,36,0.4)",
            padding: "8px 22px", borderRadius: 30, fontSize: 26, fontWeight: 800, color: "#fcd34d", whiteSpace: "nowrap",
          }}>
            {loaded} Skills Loaded
          </div>
        </div>

        {/* Your Claude remembers ... (from the actual graphic) */}
        <div style={{
          opacity: interpolate(frame, [58, 76], [0, 1], CLAMP), marginTop: 40,
          fontSize: 26, color: "#ffedd5", fontWeight: 600, textAlign: "center", maxWidth: 620, lineHeight: 1.4,
        }}>
          Your AI remembers your rules, your style, your standards.
          <br />
          <span style={{ color: "#94a3b8", fontWeight: 500 }}>Every session, it gets better.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 2 — Weekend build timeline: wire the agent Fri→Sun ── */
// local helper: gradient line draw
const useJoinLine = (frame: number, delay: number, dur = 24) =>
  interpolate(frame - delay, [0, dur], [0, 1], CLAMP);

const BuildTimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { d: "FRI", t: "Load Skills + Build steps", ic: "🗂" },
    { d: "SAT", t: "Hooks + MCP pipeline", ic: "🔌" },
    { d: "SUN", t: "Point it at a client", ic: "🚀" },
  ];
  // timeline line draws left→right
  const lineP = useJoinLine(frame, 6, 30);
  // a travelling servo dot
  const dotT = interpolate(frame, [6, 40], [0, 1], CLAMP);

  const rows = (i: number) => useChipReveal(frame, 26 + i * 16);

  return (
    <AbsoluteFill style={{ backgroundColor: "#030a10", justifyContent: "center", padding: 46 }}>
      <AnimatedGradient base="#030a10" c1="#06b6d4" c2="#2563eb" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", padding: 46 }}>
        <div style={{ opacity: interpolate(frame, [0, 14], [0, 1], CLAMP), fontSize: 48, fontWeight: 900, color: "#fff", transform: `translateY(${(1 - EASINGS.out(interpolate(frame, [0, 14], [0, 1], CLAMP))) * 24}px)` }}>
          The build.<br />
          <span style={{ color: "#22d3ee" }}>Friday → Sunday.</span>
        </div>
        <div style={{ fontSize: 26, color: "#7dd3fc", fontWeight: 500, marginTop: 8, opacity: interpolate(frame, [14, 24], [0, 1], CLAMP) }}>
          No agency. No freelancer contract. Just you + your AI.
        </div>

        {/* timeline */}
        <div style={{ marginTop: 48, position: "relative" }}>
          <div style={{ position: "absolute", top: 26, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.12)", borderRadius: 4 }}>
            <div style={{ width: `${lineP * 100}%`, height: "100%", background: "linear-gradient(90deg,#22d3ee,#3b82f6)", borderRadius: 4 }} />
          </div>
          <div style={{ position: "absolute", top: 14, left: `${dotT * 100}%`, transform: "translateX(-50%)", width: 28, height: 28, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 20px rgba(251,191,36,0.8)" }} />

          {/* day cards */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
            {steps.map((s, i) => {
              const st = rows(i);
              return (
                <div key={s.d} style={{
                  opacity: st.opacity, transform: `translateY(${st.scale === 1 ? 0 : (1 - st.scale) * 20}px) scale(${st.scale})`,
                  flex: 1, background: "rgba(2,10,20,0.85)", border: "1.5px solid rgba(56,189,248,0.4)",
                  borderRadius: 18, padding: "20px 12px", textAlign: "center", marginTop: 54,
                }}>
                  <div style={{ fontSize: 24, color: "#22d3ee", fontWeight: 900 }}>{s.d}</div>
                  <div style={{ fontSize: 40, marginTop: 8 }}>{s.ic}</div>
                  <div style={{ fontSize: 20, color: "#dbeafe", fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>{s.t}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          opacity: interpolate(frame, [78, 94], [0, 1], CLAMP), textAlign: "center", marginTop: 42,
          fontSize: 28, color: "#a5f3fc", fontWeight: 700,
        }}>
          Built from real code. <span style={{ color: "#2063ee", background: "rgba(255,255,255,0.08)", padding: "2px 10px", borderRadius: 8 }}>You can break things and rebuild.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 3 — Money wiring: invoice value counts up ── */
const MoneyWire: React.FC = () => {
  const frame = useCurrentFrame();
  // count-up 3,000 → 50,000 as money "wired"
  const t = interpolate(frame, [10, 90], [0, 1], CLAMP);
  const amt = Math.floor(3000 + t * 47000);
  const amtStr = "$" + (amt / 1000).toFixed(1) + "K";
  const pulse = usePulse(frame, 0.06, 0.03);

  const stages = [
    { t: "Skills", p: 18, col: "#34d399" },
    { t: "Build steps", p: 38, col: "#34d399" },
    { t: "Hooks + MCP", p: 60, col: "#34d399" },
    { t: "Templates", p: 100, col: "#0acf6e" },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#04120b", justifyContent: "center", padding: 46 }}>
      <AnimatedGradient base="#04120b" c1="#10b981" c2="#065f46" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", padding: 46 }}>

        <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", opacity: interpolate(frame, [0, 12], [0, 1], CLAMP) }}>
          Now it <span style={{ color: "#34d399" }}>works for you.</span>
        </div>
        <div style={{ fontSize: 26, color: "#a7f3d0", fontWeight: 500, marginTop: 6, opacity: interpolate(frame, [10, 22], [0, 1], CLAMP) }}>
          Every retainer, every invoice — handled while you sleep.
        </div>

        {/* big money counter */}
        <div style={{
          transform: `scale(${pulse.scale})`, marginTop: 30, textAlign: "center",
          background: "rgba(4,20,13,0.85)", border: "1.5px solid rgba(52,211,153,0.4)",
          borderRadius: 24, padding: "34px 30px", boxShadow: "0 0 50px rgba(16,185,129,0.3)",
        }}>
          <div style={{ fontSize: 26, color: "#6ee7b7", fontWeight: 700, letterSpacing: 1 }}>YOUR WEEKEND →</div>
          <div style={{ fontSize: 130, fontWeight: 900, color: "#34d399", lineHeight: 1.1, textShadow: "0 0 40px rgba(52,211,153,0.5)" }}>
            {amtStr}
          </div>
          <div style={{ fontSize: 24, color: "#a7f3d0", fontWeight: 600, marginTop: 4 }}>
            in templates &amp; retainers
          </div>
        </div>

        {/* capability stack bars */}
        <div style={{ marginTop: 32 }}>
          {stages.map((s, i) => {
            const so = interpolate(frame - 26 + i * 8, [0, 16], [0, 1], CLAMP);
            return (
              <div key={s.t} style={{ marginBottom: 14, opacity: so }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, fontWeight: 700, color: "#d1fae5", marginBottom: 6 }}>
                  <span>{s.t}</span>
                  <span style={{ color: "#34d399" }}>{s.p}%</span>
                </div>
                <div style={{ height: 10, background: "rgba(255,255,255,0.1)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ width: `${s.p * so}%`, height: "100%", background: `linear-gradient(90deg,${s.col},#34d399)`, borderRadius: 6, transition: "none" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── Scene 4 — CTA: wire the pulse ── */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = usePulse(frame, 0.07, 0.05);
  const boil = useBoil(frame, 7);
  const chips = [
    { t: "Skills", icon: "🧠" },
    { t: "MCP pipeline", icon: "🔗" },
    { t: "$3K–$50K models", icon: "💵" },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 46, backgroundColor: "#14040a", textAlign: "center" }}>
      <AnimatedGradient base="#14040a" c1="#ec4899" c2="#be185d" />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 46 }}>
        <div style={{ opacity: interpolate(frame, [0, 12], [0, 1], CLAMP), transform: `translateY(${(1 - EASINGS.out(interpolate(frame, [0, 12], [0, 1], CLAMP))) * 22}px)`, fontSize: 56, fontWeight: 900, color: "#fff" }}>
          Bill in <span style={{ color: "#f472b6" }}>one weekend.</span>
        </div>
        <div style={{ fontSize: 28, color: "#fbcfe8", fontWeight: 600, marginTop: 10, opacity: interpolate(frame, [10, 20], [0, 1], CLAMP) }}>
          Build it once. It bills forever.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40, width: "100%", maxWidth: 640 }}>
          {chips.map((c, i) => {
            const s = useChipReveal(frame, 20 + i * 9);
            return (
              <div key={c.t} style={{
                opacity: s.opacity, transform: `scale(${s.scale})`,
                background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(244,114,182,0.45)",
                borderRadius: 50, padding: "16px 24px", fontSize: 28, fontWeight: 800, color: "#fff",
              }}>
                {c.icon} {c.t}
              </div>
            );
          })}
        </div>

        <div style={{ transform: `scale(${pulse.scale})`, marginTop: 42, background: "linear-gradient(90deg,#ec4899,#be185d)", color: "#fff", fontSize: 36, fontWeight: 900, padding: "20px 54px", borderRadius: 50, boxShadow: "0 0 44px rgba(236,72,153,0.55)" }}>
          ⚡ Wire it this weekend
        </div>
        <div style={{ marginTop: 20, fontSize: 24, color: "#fce7f3", opacity: interpolate(frame, [30, 46], [0, 1], CLAMP), fontWeight: 600 }}>
          Your AI, billing for you. Real code. One weekend.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BillYourAIShort: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const scene1 = 120;
  const scene2 = 200;
  const scene3 = 290;
  const scene4 = durationInFrames - scene3 - 40;
  return (
    <AbsoluteFill style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", backgroundColor: "#05070d" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={scene1}><BrainBoot /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
        <TransitionSeries.Sequence durationInFrames={scene2}><BuildTimeline /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 30 })} />
        <TransitionSeries.Sequence durationInFrames={scene3}><MoneyWire /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 40 })} />
        <TransitionSeries.Sequence durationInFrames={scene4}><Cta /></TransitionSeries.Sequence>
      </TransitionSeries>
      <FilmGrain />
      <Scanlines />
      <Vignette />
      <ParticleField count={26} color="rgba(52,211,153,0.55)" />
    </AbsoluteFill>
  );
};
