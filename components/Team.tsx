'use client';

import React from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord } from './animations';
import team from '@/data/team.json';

interface TeamProps { variant?: 'light' | 'masked'; }

type Member = typeof team[number];

/**
 * Team — "Editorial Grid with Accent Cards"
 *
 * A brand-new grid layout. Each member is a flat neobrutalist card with a
 * hard-edged photo on top, a large accent index number, then name, role,
 * short bio, and social links. Hovering a card pushes it up, fades the
 * photo from greyscale to colour, and reveals an orange overlay band.
 *
 * Both variants share exactly the same DOM. Only colours differ — no
 * magnetic tilts, no different layouts. This keeps the cursor lens
 * pixel-aligned over names, faces and bios.
 */
const Team: React.FC<TeamProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';
  const borderCol   = isMasked ? 'rgba(255,253,248,0.22)' : '#0A0A0A';
  const mutedCol    = isMasked ? 'rgba(255,253,248,0.5)'  : 'rgba(10,10,10,0.5)';
  const finalColor  = isMasked ? '#FFFDF8' : '#0A0A0A';
  const orange      = isMasked ? '#FFFDF8' : '#EB5939';

  const [headerRef, headerInView] = useInView({ threshold: 0.25, triggerOnce: false });

  return (
    <section
      id="team"
      className="w-full overflow-hidden relative"
      style={{ background: isMasked ? 'transparent' : 'var(--background)' }}
    >
      {/* Decorative role marquee — light layer only */}
      {!isMasked && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-28 pointer-events-none overflow-hidden select-none opacity-[0.045]"
        >
          <div className="flex gap-16 whitespace-nowrap text-[14vw] avalon-bold leading-none team-bg-marquee">
            <span>{team.map((m) => m.role).join(' • ')} • </span>
            <span>{team.map((m) => m.role).join(' • ')} • </span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32 relative z-10">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-14 md:mb-20 gap-6">
          <div ref={isMasked ? undefined : headerRef}>
            <p
              className="text-xs avalon-bold uppercase tracking-[0.4em] mb-4"
              style={{ color: isMasked ? 'rgba(255,253,248,0.6)' : '#EB5939' }}
            >
              The People Behind It
            </p>
            <h2
              className={`${textColor} avalon-bold leading-[0.9] tracking-tight m-0`}
              style={{ fontSize: 'clamp(38px, 6vw, 80px)' }}
              data-mask-expand="480"
            >
              <AnimatedWord delay={0}   inView={headerInView} animate={!isMasked} finalColor={finalColor}>Small</AnimatedWord>{' '}
              <AnimatedWord delay={100} inView={headerInView} animate={!isMasked} finalColor={finalColor}>team.</AnimatedWord>
              <br />
              <AnimatedWord delay={220} inView={headerInView} animate={!isMasked} finalColor={finalColor}>Big</AnimatedWord>{' '}
              <AnimatedWord delay={320} inView={headerInView} animate={!isMasked} finalColor={finalColor}>shipping.</AnimatedWord>
            </h2>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 text-xs avalon-bold uppercase tracking-[0.25em]"
                 style={{ color: isMasked ? 'rgba(255,253,248,0.7)' : '#0A0A0A' }}>
              <span className="tabular-nums">{team.length.toString().padStart(2, '0')}</span>
              <span className="h-px w-8" style={{ background: mutedCol }} />
              <span>Humans</span>
            </div>
            <p className={`text-sm avalon leading-relaxed max-w-xs text-right ${textColor} opacity-40`} style={textStyle}>
              No junior devs. No hand-offs.<br />Every pixel is crafted by senior builders.
            </p>
          </div>
        </div>

        <div style={{ borderTop: `3px solid ${borderCol}` }} className="mb-10 md:mb-14" />

        {/* ── Grid of member cards ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {team.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              isMasked={isMasked}
              orange={orange}
              borderCol={borderCol}
              mutedCol={mutedCol}
              finalColor={finalColor}
              textStyle={textStyle}
            />
          ))}
        </div>

      </div>

      <style jsx>{`
        .team-bg-marquee { animation: marquee-scroll 60s linear infinite; }
      `}</style>
    </section>
  );
};

// ── Member card ──────────────────────────────────────────────────────
const MemberCard: React.FC<{
  member: Member;
  index: number;
  isMasked: boolean;
  orange: string;
  borderCol: string;
  mutedCol: string;
  finalColor: string;
  textStyle: React.CSSProperties;
}> = ({ member, index, isMasked, orange, borderCol, mutedCol, finalColor, textStyle }) => {
  const [cardRef, inView] = useInView({ threshold: 0.12, triggerOnce: false });
  const numStr = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={isMasked ? undefined : cardRef}
      className="team-card group relative flex flex-col overflow-hidden"
      style={{
        border: `2.5px solid ${borderCol}`,
        boxShadow: isMasked ? 'none' : '6px 6px 0 #0A0A0A',
        background: isMasked ? 'rgba(255,253,248,0.05)' : '#FFFDF8',
        opacity: isMasked ? 1 : (inView ? 1 : 0),
        transform: isMasked ? 'none' : (inView ? 'translateY(0)' : 'translateY(20px)'),
        transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
        transitionDelay: isMasked ? '0s' : `${index * 120}ms`,
      }}
      data-mask-expand="400"
    >
      {/* Accent ribbon */}
      <div style={{ height: 4, background: orange, flexShrink: 0 }} />

      {/* Photo panel */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: '4/5',
          background: isMasked ? 'rgba(255,253,248,0.08)' : '#F3EFE5',
          borderBottom: `2.5px solid ${borderCol}`,
        }}
      >
        {isMasked ? (
          <div className="absolute inset-0" style={{ background: 'rgba(255,253,248,0.06)' }} />
        ) : (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top team-photo"
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
            priority={index < 2}
          />
        )}

        {/* Big ghost index number */}
        <span
          aria-hidden
          className="absolute select-none pointer-events-none avalon-bold team-ghost-num"
          style={{
            fontSize: 'clamp(90px, 11vw, 160px)',
            lineHeight: 1,
            opacity: isMasked ? 0.18 : 0.85,
            color: isMasked ? '#FFFDF8' : '#FFFDF8',
            mixBlendMode: isMasked ? 'normal' : 'difference',
            bottom: 12,
            right: 10,
            letterSpacing: '-0.04em',
          }}
        >
          {numStr}
        </span>

        {/* Role pill — top-left */}
        <div
          className="absolute top-4 left-4 text-[10px] avalon-bold uppercase tracking-[0.22em] px-2.5 py-1"
          style={{
            background: isMasked ? 'rgba(255,253,248,0.1)' : '#FFFDF8',
            color: finalColor,
            border: `1.5px solid ${borderCol}`,
          }}
        >
          {member.role}
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-3 p-6 md:p-7">

        {/* Index + accent rule */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] avalon-bold tabular-nums tracking-widest" style={{ color: orange }}>
            {numStr}
          </span>
          <span className="w-8 h-px" style={{ background: orange, opacity: 0.6 }} />
        </div>

        {/* Name */}
        <h3
          className="avalon-bold leading-[0.95] tracking-tight m-0"
          style={{ fontSize: 'clamp(26px, 2.3vw, 36px)', color: finalColor }}
          data-mask-expand="420"
        >
          {member.name.split(' ').map((word, wi, arr) => (
            <React.Fragment key={wi}>
              <AnimatedWord
                delay={wi * 120}
                inView={inView}
                animate={!isMasked}
                finalColor={finalColor}
              >
                {word}
              </AnimatedWord>
              {wi < arr.length - 1 && ' '}
            </React.Fragment>
          ))}
        </h3>

        {/* Bio */}
        <p className="avalon text-[14px] leading-relaxed" style={{ color: finalColor, opacity: 0.65, ...textStyle }}>
          {member.bio}
        </p>

        {/* Social row */}
        <div className="flex items-center gap-2 pt-2 mt-auto">
          {member.social.linkedin && (
            <SocialPill href={member.social.linkedin} label="in" isMasked={isMasked} orange={orange} borderCol={borderCol} finalColor={finalColor} />
          )}
          {(member.social as any).twitter && (
            <SocialPill href={(member.social as any).twitter} label="x" isMasked={isMasked} orange={orange} borderCol={borderCol} finalColor={finalColor} />
          )}
          {(member.social as any).github && (
            <SocialPill href={(member.social as any).github} label="gh" isMasked={isMasked} orange={orange} borderCol={borderCol} finalColor={finalColor} />
          )}
        </div>
      </div>

      <style jsx>{`
        .team-card:hover {
          box-shadow: ${isMasked ? 'none' : '10px 10px 0 #0A0A0A'};
          transform: translateY(-3px);
        }
        .team-card .team-photo {
          filter: grayscale(${isMasked ? '0%' : '80%'}) contrast(1.04);
          transform: scale(1.0);
          transition: filter 0.5s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1);
          transform-origin: top center;
        }
        .team-card:hover .team-photo {
          filter: grayscale(0%) contrast(1.03);
          transform: scale(1.04);
        }
        .team-card .team-ghost-num {
          transform: translateY(0);
          transition: transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease;
        }
        .team-card:hover .team-ghost-num {
          transform: translateY(-6px);
          opacity: 0.95;
        }
      `}</style>
    </article>
  );
};

// ── Social pill ──────────────────────────────────────────────────────
const SocialPill: React.FC<{
  href: string;
  label: string;
  isMasked: boolean;
  orange: string;
  borderCol: string;
  finalColor: string;
}> = ({ href, label, isMasked, orange, borderCol, finalColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="social-pill group/pill relative overflow-hidden flex items-center justify-center uppercase avalon-bold text-[10px] tracking-[0.1em]"
    style={{
      width: 34,
      height: 34,
      border: `1.5px solid ${borderCol}`,
      color: finalColor,
      background: isMasked ? 'transparent' : '#FFFDF8',
    }}
  >
    <span
      aria-hidden
      className="absolute inset-0 translate-y-[101%] group-hover/pill:translate-y-0 transition-transform duration-[380ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
      style={{ background: orange }}
    />
    <span className="relative z-10 group-hover/pill:text-white transition-colors duration-300">
      {label}
    </span>
  </a>
);

export default Team;
