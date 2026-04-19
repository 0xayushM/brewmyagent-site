'use client';

import React from 'react';

interface HeroGraphicProps {
  /** 'masked' skips animations so overlay geometry aligns pixel-for-pixel. */
  variant?: 'light' | 'masked';
}

/**
 * HeroGraphic — Animated "AI constellation" SVG for the hero section.
 *
 * Visualises a neural-network core:
 *   • A central hub node pulsing slowly.
 *   • 6 satellite nodes arranged in a hexagon, each linked to the hub by
 *     an animated dashed data-flow line.
 *   • A slow-rotating outer ring and a counter-rotating inner ring.
 *   • Floating data packets (tiny squares) drifting around.
 *   • A ticker-style label at the bottom — "NEURAL CORE • ACTIVE".
 *
 * Both variants render IDENTICAL DOM and SVG geometry; only colours and
 * animation state differ, so the cursor-mask overlay lines up perfectly.
 */
const HeroGraphic: React.FC<HeroGraphicProps> = ({ variant = 'light' }) => {
  const isMasked = variant === 'masked';

  // Colour palette
  const stroke   = isMasked ? '#FFFDF8' : '#0A0A0A';
  const accent   = isMasked ? '#FFFDF8' : '#EB5939';
  const muted    = isMasked ? 'rgba(255,253,248,0.3)' : 'rgba(10,10,10,0.3)';
  const fill     = isMasked ? 'rgba(255,253,248,0.06)' : '#FFFDF8';
  const panelBg  = isMasked ? 'rgba(255,253,248,0.04)' : '#FFFDF8';

  // Satellite node positions — 6 around the central hub
  const CENTER = { x: 220, y: 220 };
  const RADIUS = 140;
  const SATELLITES = Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return {
      id:     `sat-${i}`,
      label:  ['INPUT', 'TRAIN', 'INFER', 'ROUTE', 'SHIP', 'SCALE'][i],
      x:      CENTER.x + Math.cos(angle) * RADIUS,
      y:      CENTER.y + Math.sin(angle) * RADIUS,
      delay:  i * 0.45,
    };
  });

  return (
    <div
      className="relative w-full h-full select-none pointer-events-none"
      data-mask-expand="420"
      aria-hidden
    >
      <svg
        viewBox="0 0 440 440"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <pattern id={`hg-grid-${variant}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <path d="M 18 0 L 0 0 0 18" fill="none" stroke={muted} strokeOpacity="0.18" strokeWidth="0.5" />
          </pattern>
          <radialGradient id={`hg-glow-${variant}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%"  stopColor={accent} stopOpacity="0.55" />
            <stop offset="70%" stopColor={accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Background grid ───────────────────────────────────── */}
        <rect x="0" y="0" width="440" height="440" fill={`url(#hg-grid-${variant})`} />

        {/* ── Outer rotating ring ───────────────────────────────── */}
        <g className={isMasked ? '' : 'hg-rotate-slow'} style={{ transformOrigin: '220px 220px' }}>
          <circle cx="220" cy="220" r="200" fill="none" stroke={muted} strokeWidth="1" strokeDasharray="3 8" />
          {/* four tick marks at cardinal points */}
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 220 220)`}>
              <line x1="220" y1="12" x2="220" y2="28" stroke={stroke} strokeWidth="2" />
            </g>
          ))}
        </g>

        {/* ── Middle counter-rotating ring ──────────────────────── */}
        <g className={isMasked ? '' : 'hg-rotate-rev'} style={{ transformOrigin: '220px 220px' }}>
          <circle cx="220" cy="220" r="170" fill="none" stroke={accent} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="1 6" />
        </g>

        {/* ── Soft glow behind hub (light only) ─────────────────── */}
        {!isMasked && (
          <circle cx="220" cy="220" r="120" fill={`url(#hg-glow-${variant})`} />
        )}

        {/* ── Connection edges (hub ↔ satellites) ───────────────── */}
        {SATELLITES.map((s, i) => (
          <g key={`edge-${i}`}>
            {/* Base line */}
            <line
              x1={CENTER.x} y1={CENTER.y}
              x2={s.x}      y2={s.y}
              stroke={muted}
              strokeWidth="1"
            />
            {/* Animated flow overlay */}
            <line
              x1={CENTER.x} y1={CENTER.y}
              x2={s.x}      y2={s.y}
              stroke={accent}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="5 9"
              className={isMasked ? '' : 'hg-flow'}
              style={{ animationDelay: `${s.delay}s` }}
            />
            {/* Travelling data packet (light only) */}
            {!isMasked && (
              <circle
                r="3.2"
                fill={accent}
                className="hg-packet"
                style={{
                  animationDelay:  `${s.delay}s`,
                  offsetPath:      `path('M ${CENTER.x} ${CENTER.y} L ${s.x} ${s.y}')` as any,
                }}
              />
            )}
          </g>
        ))}

        {/* ── Satellite nodes ──────────────────────────────────── */}
        {SATELLITES.map((s, i) => (
          <g
            key={s.id}
            className={isMasked ? '' : 'hg-node'}
            style={{ animationDelay: `${0.5 + i * 0.12}s` }}
          >
            {/* Shadow plate (light only) */}
            {!isMasked && (
              <rect
                x={s.x - 32 + 3} y={s.y - 18 + 3}
                width="64" height="36"
                fill={stroke}
              />
            )}
            {/* Box */}
            <rect
              x={s.x - 32} y={s.y - 18}
              width="64" height="36"
              fill={panelBg}
              stroke={stroke}
              strokeWidth="2"
            />
            {/* Accent corner */}
            <polygon
              points={`${s.x + 32 - 10},${s.y - 18} ${s.x + 32},${s.y - 18} ${s.x + 32},${s.y - 18 + 10}`}
              fill={accent}
            />
            {/* Label */}
            <text
              x={s.x} y={s.y + 4}
              textAnchor="middle"
              fontFamily="Avalon, sans-serif"
              fontWeight="700"
              fontSize="10"
              letterSpacing="1.6"
              fill={stroke}
            >
              {s.label}
            </text>
            {/* Index dot */}
            <circle cx={s.x - 24} cy={s.y - 10} r="1.6" fill={accent} />
          </g>
        ))}

        {/* ── Central HUB ─────────────────────────────────────── */}
        <g className={isMasked ? '' : 'hg-hub'} style={{ transformOrigin: '220px 220px' }}>
          {/* outer pulse ring */}
          <circle
            cx="220" cy="220" r="52"
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={isMasked ? '' : 'hg-pulse'}
            style={{ transformOrigin: '220px 220px' }}
          />
          {/* shadow plate (light only) */}
          {!isMasked && (
            <rect x={220 - 36 + 4} y={220 - 36 + 4} width="72" height="72" fill={stroke} />
          )}
          {/* box */}
          <rect
            x={220 - 36} y={220 - 36}
            width="72" height="72"
            fill={isMasked ? 'rgba(255,253,248,0.08)' : '#0A0A0A'}
            stroke={stroke}
            strokeWidth="2.5"
          />
          {/* accent corner */}
          <polygon
            points={`${220 + 36 - 16},${220 - 36} ${220 + 36},${220 - 36} ${220 + 36},${220 - 36 + 16}`}
            fill={accent}
          />
          {/* centre glyph — stylised "A" (AI) */}
          <text
            x="220" y="228"
            textAnchor="middle"
            fontFamily="Avalon, sans-serif"
            fontWeight="700"
            fontSize="28"
            letterSpacing="-1"
            fill={isMasked ? '#FFFDF8' : '#EB5939'}
          >
            AI
          </text>
          {/* label ribbon */}
          <text
            x="220" y="196"
            textAnchor="middle"
            fontFamily="Avalon, sans-serif"
            fontWeight="700"
            fontSize="7"
            letterSpacing="2.4"
            fill={isMasked ? 'rgba(255,253,248,0.6)' : 'rgba(255,253,248,0.7)'}
          >
            NEURAL CORE
          </text>
        </g>

        {/* ── Floating accent shapes (non-layout) ─────────────── */}
        <g className={isMasked ? '' : 'hg-drift-a'}>
          <rect x="38" y="56" width="14" height="14" fill={accent} transform="rotate(18 45 63)" />
        </g>
        <g className={isMasked ? '' : 'hg-drift-b'}>
          <circle cx="400" cy="80" r="6" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="2 3" />
        </g>
        <g className={isMasked ? '' : 'hg-drift-c'}>
          <circle cx="70" cy="380" r="4" fill={stroke} />
        </g>
        <g className={isMasked ? '' : 'hg-drift-d'}>
          <polygon points="390,380 404,380 397,392" fill={accent} />
        </g>

        {/* ── Bottom status bar ───────────────────────────────── */}
        <g transform="translate(20 412)">
          <rect x="0" y="0" width="220" height="14" fill="none" stroke={muted} strokeWidth="1" />
          <rect
            x="0" y="0"
            height="14"
            fill={accent}
            className={isMasked ? '' : 'hg-progress'}
          />
          <text x="232" y="11" fontFamily="Avalon, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2" fill={muted}>
            NEURAL CORE — ACTIVE
          </text>
        </g>
      </svg>

      <style jsx>{`
        :global(.hg-flow) {
          animation: hg-dash 1.6s linear infinite;
        }
        @keyframes hg-dash {
          to { stroke-dashoffset: -28; }
        }

        :global(.hg-packet) {
          animation: hg-travel 2.4s cubic-bezier(0.6, 0.05, 0.35, 1) infinite;
          offset-rotate: 0deg;
        }
        @keyframes hg-travel {
          0%   { offset-distance: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }

        :global(.hg-node) {
          opacity: 0;
          transform: translateY(6px);
          animation: hg-node-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes hg-node-in {
          to { opacity: 1; transform: translateY(0); }
        }

        :global(.hg-hub) {
          animation: hg-hub-bob 4s ease-in-out infinite;
        }
        @keyframes hg-hub-bob {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.04); }
        }

        :global(.hg-pulse) {
          animation: hg-pulse 2.8s ease-in-out infinite;
        }
        @keyframes hg-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%      { transform: scale(1.12); opacity: 1;   }
        }

        :global(.hg-rotate-slow) {
          animation: hg-spin 40s linear infinite;
        }
        :global(.hg-rotate-rev) {
          animation: hg-spin 22s linear infinite reverse;
        }
        @keyframes hg-spin {
          to { transform: rotate(360deg); }
        }

        :global(.hg-drift-a) {
          transform-origin: 45px 63px;
          animation: hg-drift-a 6s ease-in-out infinite;
        }
        @keyframes hg-drift-a {
          0%, 100% { transform: translate(0, 0)     rotate(18deg); }
          50%      { transform: translate(8px, 6px) rotate(-12deg); }
        }
        :global(.hg-drift-b) {
          animation: hg-drift-b 5s ease-in-out infinite;
        }
        @keyframes hg-drift-b {
          0%, 100% { transform: translate(0, 0);    opacity: 0.6; }
          50%      { transform: translate(-6px, 8px); opacity: 1;  }
        }
        :global(.hg-drift-c) {
          animation: hg-drift-c 7s ease-in-out infinite;
        }
        @keyframes hg-drift-c {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(10px, -8px); }
        }
        :global(.hg-drift-d) {
          animation: hg-drift-d 5.5s ease-in-out infinite;
        }
        @keyframes hg-drift-d {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(-7px, -9px); }
        }

        :global(.hg-progress) {
          width: 0;
          animation: hg-progress 5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        @keyframes hg-progress {
          0%   { width: 0;   opacity: 0.85; }
          70%  { width: 220px; opacity: 1; }
          100% { width: 220px; opacity: 0.4; }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.hg-flow),
          :global(.hg-packet),
          :global(.hg-node),
          :global(.hg-hub),
          :global(.hg-pulse),
          :global(.hg-rotate-slow),
          :global(.hg-rotate-rev),
          :global(.hg-drift-a),
          :global(.hg-drift-b),
          :global(.hg-drift-c),
          :global(.hg-drift-d),
          :global(.hg-progress) {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
          :global(.hg-progress) { width: 220px; }
        }
      `}</style>
    </div>
  );
};

export default HeroGraphic;
