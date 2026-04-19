'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { gsap } from 'gsap';
import { AnimatedWord } from './animations';
import projectsData from '@/data/projects.json';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  url?: string;
  year: string;
  technologies: string[];
  video?: string;
}
const projects = projectsData as Project[];

interface ProjectsProps { variant?: 'light' | 'masked'; }

const HEADING_WORDS = ['Work', 'we', 'ship.', 'Not', 'just', 'decks.'];

/**
 * Projects — "Editorial Index + Sticky Spotlight"
 *
 * Left column: numbered list of every project title, each row is a
 * hover/click target that promotes the project into the spotlight.
 * Right column: a card locked into place as the list scrolls past it.
 *
 * Because GSAP ScrollSmoother translates `#smooth-content`, native CSS
 * `position: sticky` breaks. We implement sticky manually by tracking
 * scrollTop from the smoother and translating the card within its
 * column. The same effect runs for the masked layer too, so the cursor
 * lens stays aligned over the card at all times.
 */
const Projects: React.FC<ProjectsProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';
  const borderCol   = isMasked ? 'rgba(255,253,248,0.2)' : '#0A0A0A';
  const mutedCol    = isMasked ? 'rgba(255,253,248,0.5)' : 'rgba(10,10,10,0.5)';
  const finalColor  = isMasked ? '#FFFDF8' : '#0A0A0A';
  const orange      = isMasked ? '#FFFDF8' : '#EB5939';

  const [activeIdx, setActiveIdx] = useState(0);
  const [headingRef, headingInView] = useInView({ threshold: 0.25, triggerOnce: false });

  // Auto-cycle when idle — only run once on the light layer so the masked
  // layer follows along via its own state. We broadcast active-index via a
  // window event so both variants stay synchronised.
  const idleRef = useRef(true);
  useEffect(() => {
    if (isMasked) {
      const onSync = (e: Event) => {
        const idx = (e as CustomEvent).detail as number;
        setActiveIdx(idx);
      };
      window.addEventListener('bma:project-index', onSync);
      return () => window.removeEventListener('bma:project-index', onSync);
    }
    const id = setInterval(() => {
      if (!idleRef.current) return;
      setActiveIdx((i) => {
        const next = (i + 1) % projects.length;
        window.dispatchEvent(new CustomEvent('bma:project-index', { detail: next }));
        return next;
      });
    }, 4200);
    return () => clearInterval(id);
  }, [isMasked]);

  const setActive = (i: number) => {
    setActiveIdx(i);
    window.dispatchEvent(new CustomEvent('bma:project-index', { detail: i }));
  };

  // ── Manual sticky spotlight — bypasses ScrollSmoother transform ─
  //
  // Only the LIGHT layer computes the translateY value (so both variants
  // can't disagree due to measurement differences). The computed value is
  // broadcast through a window CustomEvent and applied verbatim to both
  // layers' card refs, guaranteeing the masked overlay tracks the light
  // card pixel-for-pixel.
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const stickyCardRef      = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const card = stickyCardRef.current;
    if (!card) return;

    // Masked variant — passive listener. It just mirrors the translateY
    // published by the light layer.
    if (isMasked) {
      const apply = (e: Event) => {
        const y = (e as CustomEvent).detail as number;
        card.style.transform = y === 0 ? '' : `translateY(${y}px)`;
      };
      window.addEventListener('bma:project-stickyY', apply);
      return () => window.removeEventListener('bma:project-stickyY', apply);
    }

    // Light variant — active publisher.
    const container = stickyContainerRef.current;
    if (!container) return;

    const TOP_OFFSET   = 110; // distance from viewport top
    const BOTTOM_GUARD = 40;
    let lastY = -1;

    const tick = () => {
      if (window.innerWidth < 1024) {
        if (lastY !== 0) {
          lastY = 0;
          card.style.transform = '';
          window.dispatchEvent(new CustomEvent('bma:project-stickyY', { detail: 0 }));
        }
        return;
      }
      const rect = container.getBoundingClientRect();
      const cardH = card.offsetHeight;
      const overshoot = TOP_OFFSET - rect.top;
      const maxY = container.clientHeight - cardH - BOTTOM_GUARD;
      const y = Math.max(0, Math.min(maxY, overshoot));

      if (y === lastY) return;
      lastY = y;
      card.style.transform = y === 0 ? '' : `translateY(${y}px)`;
      window.dispatchEvent(new CustomEvent('bma:project-stickyY', { detail: y }));
    };

    gsap.ticker.add(tick);
    tick();
    window.addEventListener('resize', tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('resize', tick);
    };
  }, [isMasked]);

  const active = projects[activeIdx];

  return (
    <section id="work" className="w-full px-6 md:px-12 lg:px-20 py-24 md:py-32 relative overflow-hidden">

      {/* Decorative background marquee — light layer only (decoration, not layout) */}
      {!isMasked && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-[18%] pointer-events-none select-none opacity-[0.04] overflow-hidden"
        >
          <div className="flex gap-16 whitespace-nowrap text-[16vw] avalon-bold leading-none projects-bg-marquee">
            <span>SHIP — BUILD — LAUNCH — SHIP — BUILD — LAUNCH — </span>
            <span>SHIP — BUILD — LAUNCH — SHIP — BUILD — LAUNCH — </span>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-14 md:mb-20 gap-6 relative z-10">
        <div>
          <p className={`${accentColor} text-xs uppercase tracking-[0.4em] avalon-bold mb-4`} style={textStyle}>
            Selected Work
          </p>
          <h2
            ref={isMasked ? undefined : headingRef}
            className={`${textColor} text-4xl md:text-5xl lg:text-6xl avalon-bold tracking-tight leading-[0.95] max-w-2xl`}
            data-mask-expand="460"
          >
            {HEADING_WORDS.map((word, wi) => (
              <React.Fragment key={wi}>
                <AnimatedWord
                  delay={wi * 90}
                  inView={headingInView}
                  animate={!isMasked}
                  finalColor={finalColor}
                >
                  {word}
                </AnimatedWord>
                {wi < HEADING_WORDS.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </h2>
        </div>

        <div className="hidden md:flex flex-col items-end gap-2">
          <div
            className="flex items-center gap-3 text-xs avalon-bold uppercase tracking-[0.25em]"
            style={{ color: isMasked ? 'rgba(255,253,248,0.7)' : '#0A0A0A' }}
          >
            <span className="tabular-nums">{projects.length.toString().padStart(2, '0')}</span>
            <span className="h-px w-8" style={{ background: mutedCol }} />
            <span>Projects</span>
          </div>
          <p className={`text-sm avalon leading-relaxed max-w-xs text-right ${textColor} opacity-40`} style={textStyle}>
            Hover a title to preview. Click to open.
          </p>
        </div>
      </div>

      <div style={{ borderTop: '3px solid', borderColor: borderCol }} className="relative z-10" />

      {/* ── Two-column index + sticky spotlight ────────────────────── */}
      <div
        ref={stickyContainerRef}
        className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 relative z-10 pt-10 md:pt-14"
      >

        {/* ── LEFT: numbered index ─────────────────────────────────── */}
        <ol className="flex flex-col">
          {projects.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <li
                key={p.id}
                onMouseEnter={() => { idleRef.current = false; if (!isMasked) setActive(i); }}
                onMouseLeave={() => { idleRef.current = true; }}
                onClick={() => setActive(i)}
                className="project-row group relative overflow-hidden cursor-pointer"
                style={{
                  borderBottom: '1px solid',
                  borderColor: borderCol,
                  padding: '26px 0',
                }}
                data-mask-expand="300"
              >
                <a
                  href={p.url || '#'}
                  target={p.url ? '_blank' : undefined}
                  rel={p.url ? 'noopener noreferrer' : undefined}
                  className="relative z-10 flex items-center gap-4 md:gap-6"
                >
                  {/* Index */}
                  <span
                    className="text-xs avalon-bold tabular-nums tracking-widest shrink-0"
                    style={{
                      color: isActive ? orange : mutedCol,
                      transition: 'color 0.3s ease',
                      width: 28,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Title */}
                  <span
                    className={`avalon-bold leading-tight tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                    style={{
                      fontSize: 'clamp(22px, 2.8vw, 38px)',
                      color: finalColor,
                      transform: isActive ? 'translateX(10px)' : 'translateX(0)',
                    }}
                  >
                    {p.title}
                  </span>

                  {/* Category */}
                  <span
                    className="hidden md:inline-block text-[10px] avalon-bold uppercase tracking-[0.22em] ml-auto mr-2 shrink-0"
                    style={{
                      color: mutedCol,
                      opacity: isActive ? 1 : 0.6,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    {p.category}
                  </span>

                  {/* Year */}
                  <span
                    className="text-[10px] avalon-bold tabular-nums tracking-widest shrink-0"
                    style={{
                      color: isActive ? orange : mutedCol,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {p.year}
                  </span>

                  {/* Arrow */}
                  <span
                    className="text-lg shrink-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    aria-hidden
                    style={{
                      color: orange,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateX(0) rotate(0)' : 'translateX(-8px) rotate(-20deg)',
                    }}
                  >
                    ↗
                  </span>
                </a>

                {/* Active orange underline */}
                <span
                  aria-hidden
                  className="absolute left-0 bottom-0 h-[2px]"
                  style={{
                    background: orange,
                    width: isActive ? '100%' : '0%',
                    transition: 'width 0.55s cubic-bezier(0.22,1,0.36,1)',
                  }}
                />
              </li>
            );
          })}
        </ol>

        {/* ── RIGHT column — acts as sticky track ──────────────────── */}
        <div className="relative">
          <div
            ref={stickyCardRef}
            className="w-full"
            style={{ willChange: 'transform' }}
          >
            <div
              className="relative overflow-hidden"
              style={{
                border: '2.5px solid',
                borderColor: borderCol,
                boxShadow: isMasked ? 'none' : '8px 8px 0 #0A0A0A',
                background: isMasked ? 'rgba(255,253,248,0.06)' : '#FFFDF8',
              }}
              data-mask-expand="380"
            >
              {/* Accent ribbon */}
              <div style={{ height: 4, background: orange }} />

              {/* Image */}
              <div
                className="relative w-full"
                style={{ aspectRatio: '16/10', background: isMasked ? 'rgba(255,253,248,0.08)' : '#0A0A0A' }}
              >
                {projects.map((p, i) => (
                  <div
                    key={p.id}
                    className="absolute inset-0"
                    style={{
                      opacity: i === activeIdx ? 1 : 0,
                      transition: 'opacity 0.55s cubic-bezier(0.22,1,0.36,1)',
                    }}
                    aria-hidden={i !== activeIdx}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className={isMasked ? 'object-cover opacity-0' : 'object-cover'}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority={i === 0}
                    />
                    {isMasked && (
                      <div className="absolute inset-0" style={{ background: 'rgba(255,253,248,0.08)' }} />
                    )}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }}
                    />
                  </div>
                ))}

                {/* Counter — top-left */}
                <div
                  className="absolute top-4 left-4 z-10 text-[10px] avalon-bold uppercase tracking-[0.22em] px-2.5 py-1"
                  style={{
                    background: orange,
                    color: isMasked ? '#EB5939' : '#fff',
                    border: isMasked ? 'none' : '1.5px solid #0A0A0A',
                    boxShadow: isMasked ? 'none' : '2px 2px 0 #0A0A0A',
                  }}
                >
                  {String(activeIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </div>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-3 px-6 pt-5" style={{ color: mutedCol }}>
                <span className="text-[10px] avalon-bold uppercase tracking-[0.22em]" style={{ color: orange }}>
                  {active.category}
                </span>
                <span className="w-4 h-px" style={{ background: mutedCol }} />
                <span className="text-[10px] avalon-bold uppercase tabular-nums tracking-[0.22em]">
                  {active.year}
                </span>
              </div>

              {/* Title */}
              <h3
                className="avalon-bold leading-[0.95] tracking-tight px-6 pt-3"
                style={{ fontSize: 'clamp(26px, 3vw, 44px)', color: finalColor }}
              >
                {active.title}
              </h3>

              {/* Description */}
              <p
                className={`avalon px-6 pt-3 leading-relaxed ${textColor} opacity-70`}
                style={{ fontSize: 'clamp(13px, 0.95vw, 15px)', ...textStyle }}
              >
                {active.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 px-6 pt-5 pb-5">
                {active.technologies.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] avalon-bold uppercase px-2 py-1"
                    style={{
                      border: '1px solid',
                      borderColor: borderCol,
                      color: finalColor,
                      opacity: 0.75,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* View project link */}
              {active.url && (
                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn block w-full text-center avalon-bold uppercase tracking-[0.2em] text-xs py-4 relative overflow-hidden"
                  style={{
                    borderTop: '2px solid',
                    borderTopColor: borderCol,
                    background: 'transparent',
                    color: finalColor,
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-[420ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
                    style={{ background: orange }}
                  />
                  <span className="relative z-10 group-hover/btn:text-white transition-colors duration-300 inline-flex items-center gap-2">
                    View Project <span>↗</span>
                  </span>
                </a>
              )}
            </div>

            {/* Helper hint — appears under the card when sticky-active */}
            <div
              className="hidden lg:flex items-center gap-3 mt-5 justify-center"
              style={{ opacity: 0.45 }}
            >
              <span className="h-px w-6" style={{ background: mutedCol }} />
              <span
                className="text-[9px] avalon-bold uppercase tracking-[0.3em]"
                style={{ color: finalColor }}
              >
                Scroll the list
              </span>
              <span className="h-px w-6" style={{ background: mutedCol }} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .projects-bg-marquee { animation: marquee-scroll 55s linear infinite; }
        .project-row::before {
          content: '';
          position: absolute;
          inset: 0;
          background: ${isMasked ? 'rgba(255,253,248,0.04)' : 'rgba(235,89,57,0.06)'};
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .project-row:hover::before { opacity: 1; }
      `}</style>
    </section>
  );
};

export default Projects;
