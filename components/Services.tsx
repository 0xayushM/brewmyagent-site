'use client';
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord } from './animations';
import skills from '@/data/skills.json';

interface ServicesProps {
  variant?: 'light' | 'masked';
}

const HEADING_WORDS = ['Services', 'built', 'for', 'the', 'AI', 'era.'];

// ── A single service row ──────────────────────────────────────────────
// Each row is magnetically attracted to the cursor, has a cross-fading
// icon, a counting index number, and a shared full-row wipe background.
// The masked variant renders the exact same DOM (same per-letter spans,
// same wrappers) — it simply skips the animation callbacks so both layers
// of the cursor-mask overlay align pixel-for-pixel.
const ServiceRow: React.FC<{
  skill: typeof skills[0];
  index: number;
  total: number;
  isMasked: boolean;
}> = ({ skill, index, total, isMasked }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inViewRef, inView] = useInView({ threshold: 0.25, triggerOnce: false });

  // Magnetic cursor pull — disabled on masked layer to keep alignment identical.
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, { stiffness: 220, damping: 22, mass: 0.4 });
  const y    = useSpring(rawY, { stiffness: 220, damping: 22, mass: 0.4 });
  const rotate = useTransform(x, (v) => v * 0.05);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMasked) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mx = e.clientX - rect.left - rect.width / 2;
    const my = e.clientY - rect.top  - rect.height / 2;
    rawX.set(mx * 0.06);
    rawY.set(my * 0.12);
  };
  const handleLeave = () => { rawX.set(0); rawY.set(0); };

  const textColor   = isMasked ? '' : 'text-foreground';
  const accentColor = isMasked ? '' : 'text-tertiary';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};

  const finalColor = isMasked ? '#FFFDF8' : '#0A0A0A';

  // Entrance animation is opacity-only to keep both layers at the SAME
  // visual position at all times. A layout-affecting translateY would
  // create a scroll-wobble between the masked and light variants.
  return (
    <div
      ref={(node) => {
        inViewRef(node);
        if (node) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="group relative overflow-hidden cursor-pointer border-b"
      style={{
        borderColor: isMasked ? 'rgba(255,253,248,0.15)' : '#0A0A0A',
        borderBottomWidth: index === total - 1 ? 3 : 2,
        opacity: isMasked ? 1 : (inView ? 1 : 0),
        transition: 'opacity 0.6s ease',
        transitionDelay: `${index * 50}ms`,
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {/* Background wipe on hover (light layer only) */}
      {!isMasked && (
        <div
          className="absolute inset-0 w-0 group-hover:w-full transition-[width] duration-[500ms] ease-[cubic-bezier(0.77,0,0.175,1)] z-0 pointer-events-none bg-tertiary"
          aria-hidden
        />
      )}

      {/* Floating ghost number that scales in on hover */}
      {!isMasked && (
        <span
          aria-hidden
          className="ghost-num absolute pointer-events-none avalon-bold select-none"
          style={{
            fontSize: 'clamp(72px, 12vw, 160px)',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.18)',
            right: '4%',
            top: '50%',
            transform: 'translate(20px, -50%) scale(0.7)',
            opacity: 0,
            transition: 'opacity 0.45s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
            letterSpacing: '-0.04em',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      )}

      <motion.div
        style={{ x: isMasked ? 0 : x, y: isMasked ? 0 : y, rotate: isMasked ? 0 : rotate }}
        className="relative z-10 py-6 md:py-8 grid grid-cols-[3rem_1fr_auto] md:grid-cols-[4.5rem_auto_1fr_auto] items-center gap-4 md:gap-6"
      >
        {/* Index number */}
        <span
          className={`text-xs avalon-bold uppercase tracking-widest tabular-nums transition-colors duration-300 ${accentColor} group-hover:text-background`}
          style={textStyle}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Icon in a neo-brutalist box */}
        <span
          className="hidden md:flex items-center justify-center text-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-8deg] group-hover:scale-110"
          style={{
            width: 54,
            height: 54,
            border: '2.5px solid',
            borderColor: isMasked ? 'rgba(255,253,248,0.45)' : '#0A0A0A',
            background: isMasked ? 'rgba(255,253,248,0.1)' : '#FFF5E6',
            boxShadow: isMasked ? 'none' : '3px 3px 0 #0A0A0A',
          }}
        >
          {skill.icon}
        </span>

        {/* Service name */}
        <span
          className={`text-xl md:text-3xl lg:text-4xl avalon-bold tracking-tight leading-tight transition-colors duration-300 ${textColor} group-hover:text-background`}
          style={textStyle}
        >
          {/* Use per-letter AnimatedWord so masked layer DOM matches light */}
          {skill.title.split(' ').map((word, wi, arr) => (
            <React.Fragment key={wi}>
              <AnimatedWord
                animate={!isMasked}
                inView={inView}
                delay={200 + wi * 60}
                finalColor={finalColor}
              >
                {word}
              </AnimatedWord>
              {wi < arr.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </span>

        {/* Description — hidden on mobile */}
        <p
          className={`hidden md:block text-sm avalon max-w-xs text-right leading-relaxed transition-colors duration-300 ${textColor} opacity-50 group-hover:text-background group-hover:opacity-80`}
          style={textStyle}
        >
          {skill.description}
        </p>

        {/* Arrow */}
        <span
          className="text-2xl md:text-3xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 group-hover:rotate-45 text-background"
          aria-hidden
        >
          ↗
        </span>
      </motion.div>

      {/* CSS-only on-hover enhancements (ghost number reveal) */}
      <style jsx>{`
        div.group:hover :global(.ghost-num) {
          opacity: 1 !important;
          transform: translate(0, -50%) scale(1) !important;
        }
      `}</style>
    </div>
  );
};

const Services: React.FC<ServicesProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';
  const borderCol   = isMasked ? 'rgba(255,253,248,0.2)' : '#0A0A0A';
  const finalColor  = isMasked ? '#FFFDF8' : '#0A0A0A';

  const [headingRef, headingInView] = useInView({ threshold: 0.2, triggerOnce: false });

  return (
    <div id="services" className="w-full px-6 md:px-16 py-24 md:py-32 relative overflow-hidden">
      {/* Background keyword marquee — decorative ambience, disabled on mask layer */}
      {!isMasked && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.045] select-none">
          <div className="flex gap-16 whitespace-nowrap text-[18vw] avalon-bold leading-none services-marquee">
            <span>AUTOMATE &nbsp;•&nbsp; DESIGN &nbsp;•&nbsp; LAUNCH &nbsp;•&nbsp;</span>
            <span>AUTOMATE &nbsp;•&nbsp; DESIGN &nbsp;•&nbsp; LAUNCH &nbsp;•&nbsp;</span>
          </div>
        </div>
      )}

      {/* Section header */}
      <div className="flex items-end justify-between mb-14 md:mb-20 gap-6 relative z-10">
        <div>
          <p className={`${accentColor} text-xs uppercase tracking-[0.4em] avalon-bold mb-4`} style={textStyle}>
            What We Do
          </p>
          <h2
            ref={isMasked ? undefined : headingRef}
            className={`${textColor} text-4xl md:text-5xl lg:text-6xl avalon-bold tracking-tight leading-tight max-w-xl`}
            data-mask-expand="420"
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

        <div className="hidden md:flex flex-col items-end gap-3">
          <div
            className="flex items-center gap-3 text-xs avalon-bold uppercase tracking-[0.25em]"
            style={{ color: isMasked ? 'rgba(255,253,248,0.7)' : '#0A0A0A' }}
          >
            <span className="tabular-nums">{skills.length.toString().padStart(2, '0')}</span>
            <span className="h-px w-8" style={{ background: isMasked ? 'rgba(255,253,248,0.4)' : '#0A0A0A' }} />
            <span>Capabilities</span>
          </div>
          <p className={`text-sm avalon leading-relaxed max-w-xs text-right ${textColor} opacity-40`} style={textStyle}>
            Every engagement is hands-on, outcome-driven,<br />and built to last beyond the launch day.
          </p>
        </div>
      </div>

      {/* Top divider */}
      <div style={{ borderTop: `3px solid ${borderCol}` }} className="relative z-10" />

      {/* Service rows */}
      <div className="flex flex-col relative z-10">
        {skills.map((skill, i) => (
          <ServiceRow
            key={skill.id}
            skill={skill}
            index={i}
            total={skills.length}
            isMasked={isMasked}
          />
        ))}
      </div>

      <style jsx>{`
        .services-marquee {
          animation: marquee-scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Services;
