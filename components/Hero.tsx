'use client';
import React, { useEffect, useState } from 'react';
import company from '@/data/company.json';
import HeroGraphic from './HeroGraphic';

interface HeroProps { variant?: 'light' | 'masked'; }

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

  return (
    <div className="relative w-full h-full px-6 md:px-16 pb-10 md:pb-16 pt-24 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-10 lg:gap-16">
      {/* Background grid dots — decorative only, light layer only */}
      {!isMasked && <div className="absolute inset-0 dot-bg opacity-60 pointer-events-none" />}

      {/* ── LEFT: copy + CTA + stats ───────────────────────────── */}
      <div className="relative z-10 flex flex-col">
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
        className="relative z-10 hidden lg:flex items-center justify-center w-full h-full min-h-[520px]"
        style={fade(300)}
      >
        <div className="relative w-full max-w-[520px] aspect-square">
          <HeroGraphic variant={variant} />
        </div>
      </div>
    </div>
  );
};

export default Hero;
