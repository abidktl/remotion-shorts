import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { noise2D } from "@remotion/noise";

/**
 * motionKit.tsx — reusable choreography primitives for GPUIndia shorts.
 * No hard cuts, no static holds: every composition assembles from these
 * moving parts so each subject gets its own film treatment.
 *
 * Rebuilt 2026-08-08 onto the re-cloned remotion-shorts repo.
 */

export const EASINGS = {
  out: (t: number) => t * t * (3 - 2 * t), // smoothstep
  back: (v: number) => {
    const c1 = 1.70158,
      c3 = c1 + 1;
    return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2);
  },
};

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/** Two-stage kinetic statement: word lines slide in, then a marker sweep. */
export const useKineticStatement = (frame: number, start = 0) => {
  const lines = interpolate(frame - start, [0, 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sweep = interpolate(frame - start, [20, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return { lines, sweep };
};

/** Cue-timed chip pop-in (scale+opacity). */
export const useChipReveal = (frame: number, delay: number) => {
  const p = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = EASINGS.back(p);
  return { opacity: p, scale };
};

/** Gradient line draw between two labels. */
export const useJoinLine = (frame: number, delay: number, dur = 24) => {
  const p = interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return p;
};

/** Player-card flip entrance. */
export const useCardFlip = (frame: number, delay: number) => {
  const ax = spring({ frame: frame - delay, fps: 30, config: { damping: 16, stiffness: 80 } });
  const ry = interpolate(ax, [0, 1], [70, 0]);
  const fade = interpolate(ax, [0, 1], [0, 1]);
  return { ry, opacity: fade };
};

/** Sequential reveal of N cards. */
export const useStaggerCards = (frame: number, count: number) => {
  return (i: number) => {
    const delay = i * 8;
    const p = interpolate(frame - delay, [0, 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = (1 - EASINGS.out(p)) * 40;
    return { opacity: p, transform: `translateY(${y}px)` };
  };
};

/** CTA pulse (never static). */
export const usePulse = (frame: number, speed = 0.05, amp = 0.03) => ({
  scale: 1 + amp + Math.sin(frame * speed) * amp,
});

/* ─── Presentational layers ───────────────────────────────────────── */

export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
  const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: grain,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

export const Scanlines: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 4px)",
      opacity: 0.5,
      pointerEvents: "none",
    }}
  />
);

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.5) 100%)",
      pointerEvents: "none",
    }}
  />
);

/** Drifting animated gradient background — every frame moves. */
export const AnimatedGradient: React.FC<{ base: string; c1: string; c2: string }> = ({
  base,
  c1,
  c2,
}) => {
  const frame = useCurrentFrame();
  const x1 = 30 + Math.sin(frame * 0.01) * 18;
  const y1 = 25 + Math.cos(frame * 0.013) * 18;
  const x2 = 70 + Math.cos(frame * 0.011) * 18;
  const y2 = 60 + Math.sin(frame * 0.017) * 18;
  return (
    <AbsoluteFill
      style={{
        background: base,
        position: "absolute" as const,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -80,
          background: `radial-gradient(circle at ${x1}% ${y1}%, ${c1}, transparent 55%), radial-gradient(circle at ${x2}% ${y2}%, ${c2}, transparent 50%)`,
          filter: "blur(40px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const ParticleField: React.FC<{ count?: number; color?: string }> = ({
  count = 30,
  color = "rgba(255,255,255,0.7)",
}) => {
  const frame = useCurrentFrame();
  const parts = Array.from({ length: count });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {parts.map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const x = (seed % 1001) / 1001 * 100;
        const y = ((seed * 7) % 1001) / 1001 * 100;
        const drift = Math.sin(frame * 0.02 + i * 1.3) * 14;
        const size = 2 + (i % 4);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y + drift}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${size * 3}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Persistent low-amplitude boil for long-held elements (kills dead frames). */
export const useBoil = (frame: number, seed = 0) => {
  const dx = Math.sin(frame * 0.05 + seed * 1.3) * 3;
  const dy = Math.cos(frame * 0.04 + seed * 2.1) * 3;
  const rot = Math.sin(frame * 0.03 + seed) * 0.6;
  return `translate(${dx}px,${dy}px) rotate(${rot}deg) scale(${1 + Math.sin(frame * 0.02 + seed) * 0.01})`;
};

/** Animated grain (noise2D drift) for organic texture. */
export const useNoiseGrain = (frame: number, seed: number) => {
  return noise2D("gpu", frame * 0.02, seed);
};
