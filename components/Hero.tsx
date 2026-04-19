'use client';
import React, { useEffect, useState } from 'react';
import company from '@/data/company.json';
import HeroGraphic from './HeroGraphic';

interface HeroProps { variant?: 'light' | 'masked'; }

// ── Hero footer data ─────────────────────────────────────────────────
// A tight capability rail keeps the hero section from collapsing to a
// two-column grid that bottoms out early. Both layers render the exact
// same list so the cursor-lens reveals each word 1:1 across variants.
const CAPABILITIES = [
  'AI Agents',
  'LLM Pipelines',
  'Automation',
  'MVPs',
  'Brand',
  'Web',
];

const CLIENT_MARKS = [
  'Acme',
  'Northwind',
  'Globex',
  'Initech',
  'Umbrella',
  'Hooli',
];

// ── Scroll helper (uses GSAP smoother when available) ─────────────────
function scrollTo(id: string) {
  const smoother = (window as any).__gsap_smoother;
  const el = document.getElementById(id);
  if (!el) return;
  if (smoother?.scrollTo) {
    smoother.scrollTo(el, true, 'top top');
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Neo-brutalist button ──────────────────────────────────────────────
interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  primary?: boolean;
  isMasked?: boolean;
}
const NeoButton: React.FC<NeoButtonProps> = ({ children, onClick, primary = false, isMasked = false }) => {
  const bg = primary ? (isMasked ? '#FFFDF8' : '#EB5939') : 'transparent';
  const color = primary
    ? (isMasked ? '#EB5939' : '#fff')
    : (isMasked ? '#FFFDF8' : '#0A0A0A');
  const border = isMasked
    ? (primary ? '3px solid #FFFDF8' : '3px solid rgba(255,253,248,0.7)')
    : '3px solid #0A0A0A';
  const shadow = isMasked
    ? (primary ? '4px 4px 0px #FFFDF8' : '4px 4px 0px rgba(255,253,248,0.4)')
    : '4px 4px 0px #0A0A0A';
  const hoverBg = primary
    ? (isMasked ? '#EB5939' : '#0A0A0A')
    : (isMasked ? 'rgba(255,253,248,0.15)' : '#0A0A0A');

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden px-7 py-3 avalon-bold uppercase tracking-wider text-sm"
      style={{ border, boxShadow: shadow, background: bg, color }}
    >
      <span
        className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-[420ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ background: hoverBg }}
        aria-hidden
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

/**
 * Hero — "Neural Core" AI studio landing.
 *
 * Layout:
 *   Two-column grid on desktop:
 *     Left:  tag row, headline ("We Brew / Intelligence."), description,
 *            CTA buttons, stats strip.
 *     Right: HeroGraphic — an animated neural-constellation SVG.
 *
 * Both light and masked variants render identical DOM (same elements, same
 * text splitters, same inline structure). Only colour values differ so the
 * cursor-mask overlay aligns pixel-for-pixel over every character and node.
 */
const Hero: React.FC<HeroProps> = ({ variant = 'light' }) => {
  const isMasked  = variant === 'masked';
  const textColor = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accent    = isMasked ? '' : 'text-tertiary';

  // Fade-in trigger that runs identically in both layers. Affects only
  // opacity + tiny translateY on non-layout transform — safe for alignment
  // because the translate is the SAME in both layers.
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 60); return () => clearTimeout(t); }, []);

  const fade = (delay = 0): React.CSSProperties => ({
    opacity: ready ? 1 : 0,
    transform: ready ? 'translateY(0)' : 'translateY(10px)',
    transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  const mutedBorder = isMasked ? 'rgba(255,253,248,0.25)' : 'rgba(10,10,10,0.18)';

  return (
    <div className="relative w-full h-full px-6 md:px-16 pb-10 md:pb-16 pt-24 flex flex-col">
      {/* Background grid dots — decorative only, light layer only */}
      {!isMasked && <div className="absolute inset-0 dot-bg opacity-60 pointer-events-none" />}

      {/* ═══ TOP: two-column grid (copy + graphic) ═══════════════════ */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-16 flex-1">
        {/* ── LEFT: copy + CTA + stats ───────────────────────────── */}
        <div className="flex flex-col">
          {/* Tag row */}
          <div className="flex items-center gap-4 mb-6" style={fade(100)}>
            <span
              className="text-xs avalon-bold uppercase tracking-[0.3em] px-3 py-1"
              style={{
                border: isMasked ? '2px solid rgba(255,253,248,0.6)' : '2px solid #0A0A0A',
                background: isMasked ? 'transparent' : '#EB5939',
                boxShadow: isMasked ? 'none' : '3px 3px 0 #0A0A0A',
                color: isMasked ? '#FFFDF8' : '#fff',
              }}
            >
              AI Studio
            </span>
            <span className={`text-xs avalon uppercase tracking-widest ${textColor} opacity-50`} style={textStyle}>
              Est. {company.founded}
            </span>
            {/* Live status pill — pulsing green dot, extra signal filler */}
            <span
              className="hidden md:inline-flex items-center gap-2 text-[10px] avalon-bold uppercase tracking-[0.25em]"
              style={{ color: isMasked ? '#FFFDF8' : '#0A0A0A', opacity: 0.6 }}
            >
              <span
                className="relative inline-block"
                style={{ width: 8, height: 8 }}
              >
                <span
                  className="absolute inset-0 rounded-full hero-dot-pulse"
                  style={{ background: isMasked ? '#FFFDF8' : '#2ecc71' }}
                />
              </span>
              Booking Q3
            </span>
          </div>

          {/* Headline — same DOM, same text in both variants */}
          <div className="mb-6" data-mask-expand="420" style={fade(150)}>
            <h1 className={`${textColor} text-[9vw] lg:text-[5.2vw] font-bold avalon-bold uppercase leading-[0.88] tracking-tighter`} style={textStyle}>
              We Brew
            </h1>
            <h1 className={`${accent} text-[9vw] lg:text-[5.2vw] font-bold avalon-bold uppercase leading-[0.88] tracking-tighter`} style={textStyle}>
              Intelligence.
            </h1>
          </div>

          {/* Description */}
          <p
            className={`${textColor} text-sm md:text-base avalon max-w-lg leading-relaxed mb-8`}
            style={{ ...fade(650), opacity: ready ? 0.75 : 0, ...textStyle }}
          >
            {company.description}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-10" style={fade(850)}>
            <NeoButton primary isMasked={isMasked} onClick={() => scrollTo('work')}>See Our Work</NeoButton>
            <NeoButton isMasked={isMasked} onClick={() => scrollTo('services')}>Our Services</NeoButton>
          </div>

          {/* Stats */}
          <div
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 pt-8"
            style={{
              borderTop: isMasked ? '2px solid rgba(255,253,248,0.25)' : '2px solid rgba(10,10,10,0.12)',
              ...fade(1000),
            }}
          >
            {company.stats.map((stat, i) => (
              <div key={stat.label} data-mask-expand="200" style={fade(1050 + i * 80)}>
                <div className={`text-2xl md:text-3xl font-bold avalon-bold ${accent}`} style={textStyle}>{stat.value}</div>
                <div className={`text-xs uppercase tracking-widest mt-1 ${textColor} opacity-50`} style={textStyle}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Hero neural graphic ─────────────────────────── */}
        <div
          className="relative hidden lg:flex items-center justify-center w-full h-full min-h-[520px]"
          style={fade(300)}
        >
          <div className="relative w-full max-w-[520px] aspect-square">
            <HeroGraphic variant={variant} />
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM: hero footer rail — capabilities + trust + scroll ═══
          This is brand-new content added to fill the vertical gap below
          the two-column grid. It's split into three cells:
            (a) capabilities tag cluster
            (b) client mark strip
            (c) scroll-to-explore indicator
          All three render identical DOM in masked and light variants. */}
      <div
        className="relative z-10 mt-14 md:mt-20 pt-8 grid grid-cols-1 lg:grid-cols-[1.25fr_1fr_auto] gap-8 lg:gap-12 items-start"
        style={{
          borderTop: `1.5px solid ${mutedBorder}`,
          ...fade(1400),
        }}
      >
        {/* ── (a) Capabilities tag cluster ────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] avalon-bold uppercase tracking-[0.3em] ${accent}`} style={textStyle}>
              Capabilities
            </span>
            <span className="h-px flex-1 max-w-[72px]" style={{ background: mutedBorder }} />
            <span
              className={`text-[10px] avalon-bold tabular-nums tracking-[0.22em] ${textColor} opacity-50`}
              style={textStyle}
            >
              {String(CAPABILITIES.length).padStart(2, '0')}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.map((cap, i) => (
              <span
                key={cap}
                className="avalon-bold uppercase text-[11px] tracking-[0.14em] px-3 py-1.5 hero-cap-chip"
                style={{
                  border: `1.5px solid ${isMasked ? 'rgba(255,253,248,0.5)' : '#0A0A0A'}`,
                  color: isMasked ? '#FFFDF8' : '#0A0A0A',
                  background: isMasked ? 'rgba(255,253,248,0.04)' : 'transparent',
                  transitionDelay: `${i * 40}ms`,
                }}
                data-mask-expand="220"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* ── (b) Trusted-by mark strip ─────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] avalon-bold uppercase tracking-[0.3em] ${textColor} opacity-60`}
              style={textStyle}
            >
              Trusted By
            </span>
            <span className="h-px flex-1 max-w-[72px]" style={{ background: mutedBorder }} />
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {CLIENT_MARKS.map((mark, i) => (
              <React.Fragment key={mark}>
                <span
                  className="avalon-bold uppercase text-sm tracking-[0.18em] hero-client-mark"
                  style={{
                    color: isMasked ? '#FFFDF8' : '#0A0A0A',
                    opacity: 0.55,
                    letterSpacing: '0.22em',
                  }}
                >
                  {mark}
                </span>
                {i < CLIENT_MARKS.length - 1 && (
                  <span
                    aria-hidden
                    className="inline-block w-1 h-1 rounded-full"
                    style={{ background: mutedBorder }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── (c) Scroll-to-explore indicator ───────────────────────── */}
        <button
          onClick={() => scrollTo('about')}
          className="group flex items-center gap-3 self-end justify-self-end lg:justify-self-start"
          aria-label="Scroll to explore"
          data-mask-expand="240"
        >
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              border: `2px solid ${isMasked ? '#FFFDF8' : '#0A0A0A'}`,
              boxShadow: isMasked ? 'none' : '3px 3px 0 #0A0A0A',
              background: isMasked ? 'transparent' : '#FFFDF8',
              color: isMasked ? '#FFFDF8' : '#0A0A0A',
            }}
          >
            <span aria-hidden className="text-lg hero-arrow-bob">↓</span>
          </div>
          <div className="flex flex-col leading-tight text-left">
            <span
              className={`text-[10px] avalon-bold uppercase tracking-[0.3em] ${textColor}`}
              style={textStyle}
            >
              Scroll
            </span>
            <span
              className={`text-[10px] avalon uppercase tracking-[0.3em] ${textColor} opacity-50`}
              style={textStyle}
            >
              Explore
            </span>
          </div>
        </button>
      </div>

      {/* ── Local keyframes (shared across both variants) ─────────── */}
      <style jsx>{`
        @keyframes hero-dot-pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%      { transform: scale(1.4); opacity: 0.4; }
        }
        @keyframes hero-arrow-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
        .hero-dot-pulse { animation: hero-dot-pulse 2.4s ease-in-out infinite; }
        .hero-arrow-bob { animation: hero-arrow-bob 1.8s ease-in-out infinite; display: inline-block; }
        .hero-cap-chip {
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), background 0.3s ease;
        }
        .hero-cap-chip:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Hero;
