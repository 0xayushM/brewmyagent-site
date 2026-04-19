'use client';

import React from 'react';

interface WorkflowGraphProps {
  /** 'masked' renders the same SVG geometry but skips animation so the
   * cursor-mask overlay aligns pixel-perfectly with the light layer. */
  variant?: 'light' | 'masked';
}

/**
 * Animated AI workflow node graph — replaces the previous mug visualization.
 *
 * Visualises the BrewMyAgent pipeline:
 *   Idea → Strategy → AI Engine → Design → Ship
 *
 * Each node is a hard-edged neobrutalist box. Connecting edges have a
 * slow-pulsing dashed flow that looks like data flowing between stages.
 * A few floating accent shapes (orbiting dot, pulsing ring, drifting
 * square) provide ambient motion.
 *
 * Both variants render the EXACT same SVG geometry with identical viewBox
 * and node positions — only colours and animations differ. This guarantees
 * the cursor-mask overlay stays aligned over every node.
 */
const NODES: Array<{ id: string; label: string; x: number; y: number; w: number; h: number; icon: string }> = [
  { id: 'idea',     label: 'IDEA',     x:  20, y: 110, w: 120, h: 60, icon: '✦'  },
  { id: 'strategy', label: 'STRATEGY', x: 180, y:  40, w: 130, h: 60, icon: '◇'  },
  { id: 'engine',   label: 'AI ENGINE',x: 350, y: 110, w: 140, h: 60, icon: '◈'  },
  { id: 'design',   label: 'DESIGN',   x: 180, y: 200, w: 130, h: 60, icon: '◯'  },
  { id: 'ship',     label: 'SHIP',     x: 350, y: 270, w: 120, h: 60, icon: '➜'  },
];

const EDGES: Array<{ from: string; to: string }> = [
  { from: 'idea',     to: 'strategy' },
  { from: 'idea',     to: 'design'   },
  { from: 'strategy', to: 'engine'   },
  { from: 'design',   to: 'engine'   },
  { from: 'engine',   to: 'ship'     },
];

// Node center helpers
const center = (n: typeof NODES[number]) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });
const byId   = (id: string) => NODES.find((n) => n.id === id)!;

const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ variant = 'light' }) => {
  const isMasked = variant === 'masked';

  // Colours — masked layer uses the off-white background colour for everything
  const stroke   = isMasked ? '#FFFDF8' : '#0A0A0A';
  const fill     = isMasked ? 'rgba(255,253,248,0.08)' : '#FFFDF8';
  const accent   = isMasked ? '#FFFDF8' : '#EB5939';
  const text     = isMasked ? '#FFFDF8' : '#0A0A0A';
  const muted    = isMasked ? 'rgba(255,253,248,0.4)' : 'rgba(10,10,10,0.4)';
  const shadowOp = isMasked ? 0 : 1;

  return (
    <div
      className="relative w-full max-w-[520px] aspect-[510/360] select-none"
      data-mask-expand="420"
    >
      <svg
        viewBox="0 0 510 360"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="BrewMyAgent AI workflow"
      >
        <defs>
          <pattern id={`wf-grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={muted} strokeOpacity="0.25" strokeWidth="0.5" />
          </pattern>
          <marker
            id={`wf-arrow-${variant}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={accent} />
          </marker>
        </defs>

        {/* Background grid */}
        <rect x="0" y="0" width="510" height="360" fill={`url(#wf-grid-${variant})`} />

        {/* ── Edges with animated dashed flow ──────────────────────── */}
        {EDGES.map((e, i) => {
          const a = center(byId(e.from));
          const b = center(byId(e.to));
          // Use cubic bezier for a soft S-curve
          const midX = (a.x + b.x) / 2;
          const cp1  = { x: midX, y: a.y };
          const cp2  = { x: midX, y: b.y };
          const d    = `M ${a.x} ${a.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${b.x} ${b.y}`;
          return (
            <g key={`edge-${i}`}>
              {/* Static base line */}
              <path d={d} fill="none" stroke={muted} strokeWidth="1.5" />
              {/* Animated dashed overlay */}
              <path
                d={d}
                fill="none"
                stroke={accent}
                strokeWidth="2"
                strokeDasharray="6 8"
                strokeLinecap="round"
                markerEnd={`url(#wf-arrow-${variant})`}
                className={isMasked ? '' : 'wf-flow-line'}
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            </g>
          );
        })}

        {/* ── Nodes ─────────────────────────────────────────────────── */}
        {NODES.map((n, i) => (
          <g key={n.id} className={isMasked ? '' : 'wf-node'} style={{ animationDelay: `${0.6 + i * 0.5}s` }}>
            {/* Drop shadow plate (light only) */}
            {!isMasked && (
              <rect
                x={n.x + 4}
                y={n.y + 4}
                width={n.w}
                height={n.h}
                fill={stroke}
                opacity={shadowOp}
              />
            )}
            {/* Box */}
            <rect
              x={n.x}
              y={n.y}
              width={n.w}
              height={n.h}
              fill={fill}
              stroke={stroke}
              strokeWidth="2.5"
            />
            {/* Accent corner */}
            <polygon
              points={`${n.x + n.w - 14},${n.y} ${n.x + n.w},${n.y} ${n.x + n.w},${n.y + 14}`}
              fill={accent}
            />
            {/* Index */}
            <text
              x={n.x + 10}
              y={n.y + 16}
              fontFamily="Avalon, sans-serif"
              fontWeight="700"
              fontSize="9"
              letterSpacing="2"
              fill={muted}
            >
              {String(i + 1).padStart(2, '0')}
            </text>
            {/* Label */}
            <text
              x={n.x + n.w / 2}
              y={n.y + n.h / 2 + 5}
              fontFamily="Avalon, sans-serif"
              fontWeight="700"
              fontSize="13"
              letterSpacing="1.2"
              textAnchor="middle"
              fill={text}
            >
              {n.label}
            </text>
            {/* Icon */}
            <text
              x={n.x + 14}
              y={n.y + n.h - 10}
              fontFamily="Avalon, sans-serif"
              fontWeight="700"
              fontSize="14"
              fill={accent}
            >
              {n.icon}
            </text>
          </g>
        ))}

        {/* ── Floating ambient shapes ──────────────────────────────── */}
        <g className={isMasked ? '' : 'wf-orbit'}>
          <circle cx="475" cy="40" r="6" fill={accent} />
        </g>
        <g className={isMasked ? '' : 'wf-pulse'}>
          <circle cx="40" cy="40" r="14" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="3 3" />
        </g>
        <g className={isMasked ? '' : 'wf-drift'}>
          <rect x="465" y="320" width="14" height="14" fill={stroke} transform="rotate(15 472 327)" />
        </g>

        {/* Status ribbon — bottom */}
        <g>
          <rect x="20" y="338" width="200" height="14" fill="none" stroke={muted} strokeWidth="1" />
          <rect
            x="20" y="338"
            height="14"
            fill={accent}
            className={isMasked ? '' : 'wf-progress'}
            style={{ width: 200 }}
          />
          <text x="230" y="349" fontFamily="Avalon, sans-serif" fontWeight="700" fontSize="9" letterSpacing="2" fill={muted}>
            PIPELINE — LIVE
          </text>
        </g>
      </svg>

      {/* ── Local CSS animations — no DOM changes between variants ── */}
      <style jsx>{`
        :global(.wf-flow-line) {
          animation: wf-dash 1.6s linear infinite;
        }
        @keyframes wf-dash {
          to { stroke-dashoffset: -28; }
        }

        :global(.wf-node) {
          opacity: 0;
          transform: translateY(8px);
          animation: wf-node-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          transform-origin: center;
        }
        @keyframes wf-node-in {
          to { opacity: 1; transform: translateY(0); }
        }

        :global(.wf-orbit) {
          transform-origin: 255px 180px;
          animation: wf-orbit 9s linear infinite;
        }
        @keyframes wf-orbit {
          to { transform: rotate(360deg); }
        }

        :global(.wf-pulse) {
          transform-origin: 40px 40px;
          animation: wf-pulse 3.2s ease-in-out infinite;
        }
        @keyframes wf-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.5; }
          50%      { transform: scale(1.4); opacity: 1;   }
        }

        :global(.wf-drift) {
          transform-origin: 472px 327px;
          animation: wf-drift 6s ease-in-out infinite;
        }
        @keyframes wf-drift {
          0%, 100% { transform: translate(0, 0)    rotate(15deg); }
          50%      { transform: translate(-6px, -10px) rotate(-25deg); }
        }

        :global(.wf-progress) {
          width: 0;
          animation: wf-fill 4.5s cubic-bezier(0.22, 1, 0.36, 1) infinite;
        }
        @keyframes wf-fill {
          0%   { width: 0;     opacity: 0.85; }
          70%  { width: 200px; opacity: 1;    }
          100% { width: 200px; opacity: 0.4;  }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.wf-flow-line),
          :global(.wf-node),
          :global(.wf-orbit),
          :global(.wf-pulse),
          :global(.wf-drift),
          :global(.wf-progress) {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          :global(.wf-progress) { width: 200px; }
        }
      `}</style>
    </div>
  );
};

export default WorkflowGraph;
