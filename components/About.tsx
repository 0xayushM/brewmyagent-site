'use client';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord } from './animations';
import WorkflowGraph from './WorkflowGraph';
import company from '@/data/company.json';

interface AboutProps {
  variant?: 'light' | 'masked';
}

// The heading is kept in one flat word-array so the masked + light layers
// render the exact same DOM structure (same inline-block spans, same
// whitespace nodes). Any mismatch here causes the cursor-mask reveal to
// appear offset from the base layer.
const HEADING_WORDS = [
  'We', 'turn', 'big', 'ideas', 'into',
  'intelligent', 'products', 'that', 'actually', 'ship.',
];

const About: React.FC<AboutProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';

  const [headingRef, headingInView] = useInView({ threshold: 0.2, triggerOnce: false });

  // When the heading is in the masked layer we skip animation entirely but
  // keep the identical inline-block per-letter structure so layout matches.
  const finalLetterColor = isMasked ? '#FFFDF8' : '#0A0A0A';

  return (
    <div id="about" className="w-full px-6 md:px-16 py-24 md:py-32 relative overflow-hidden">
      {/* Section label */}
      <p className={`${accentColor} text-xs uppercase tracking-[0.4em] avalon-bold mb-6`} style={textStyle}>
        Who We Are
      </p>

      {/* ── Big statement — identical DOM for both layers ── */}
      <h2
        ref={isMasked ? undefined : headingRef}
        className={`${textColor} text-4xl md:text-6xl lg:text-7xl avalon-bold leading-[1.05] tracking-tight max-w-5xl mb-16`}
        data-mask-expand="420"
      >
        {HEADING_WORDS.map((word, wi) => (
          <React.Fragment key={wi}>
            <AnimatedWord
              delay={wi * 80}
              inView={headingInView}
              animate={!isMasked}
              finalColor={finalLetterColor}
            >
              {word}
            </AnimatedWord>
            {wi < HEADING_WORDS.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </h2>

      {/* ── Two-col split: copy + mug animation ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-20 items-center">
        <div>
          <p className={`${textColor} text-lg md:text-xl avalon leading-relaxed mb-6`} style={textStyle}>
            {company.description}
          </p>
          <p className={`${textColor} text-base avalon leading-relaxed opacity-80`} style={textStyle}>
            Based in Mumbai, we work with startups, scale-ups, and established businesses
            across India and beyond — helping them harness AI and great design to stay ahead.
          </p>
        </div>

        {/* Animated workflow graph — same SVG geometry in both variants so the
            cursor-mask overlay aligns pixel-for-pixel with the node positions. */}
        <div className="flex items-center justify-center">
          <WorkflowGraph variant={isMasked ? 'masked' : 'light'} />
        </div>
      </div>

      {/* ── Values grid ── */}
      <div className="pt-12" style={{ borderTop: '3px solid', borderTopColor: isMasked ? 'rgba(255,253,248,0.3)' : '#0A0A0A' }}>
        <p className={`${accentColor} text-xs uppercase tracking-[0.4em] avalon-bold mb-8`} style={textStyle}>Our Values</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {company.values.map((value, i) => (
            <div
              key={value.title}
              className="group relative overflow-hidden p-6 cursor-default"
              style={{
                border: '3px solid',
                borderColor: isMasked ? 'rgba(255,253,248,0.3)' : '#0A0A0A',
                boxShadow: isMasked ? 'none' : '4px 4px 0px #0A0A0A',
              }}
            >
              {/* Orange slide-in bg — only on the light layer to keep layers aligned */}
              {!isMasked && (
                <div className="absolute inset-0 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] bg-tertiary z-0" />
              )}
              <span
                className={`relative z-10 text-xs neo-tag mb-4 inline-block transition-colors duration-300 ${
                  isMasked
                    ? ''
                    : 'bg-tertiary text-background group-hover:bg-white group-hover:text-tertiary'
                }`}
                style={{
                  border: isMasked ? '2px solid rgba(255,253,248,0.5)' : '2px solid #0A0A0A',
                  ...(isMasked ? { background: '#FFFDF8', color: '#EB5939' } : {}),
                }}
              >
                0{i + 1}
              </span>
              <h3 className={`relative z-10 text-lg avalon-bold mb-2 transition-colors duration-300 ${isMasked ? textColor : 'text-foreground group-hover:text-white'}`} style={isMasked ? textStyle : {}}>{value.title}</h3>
              <p className={`relative z-10 text-sm avalon leading-relaxed transition-colors duration-300 ${isMasked ? `${textColor} opacity-70` : 'text-foreground opacity-70 group-hover:text-white group-hover:opacity-90'}`} style={isMasked ? textStyle : {}}>{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
