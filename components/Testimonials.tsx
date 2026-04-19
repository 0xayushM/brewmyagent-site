'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord } from './animations';
import testimonials from '@/data/testimonials.json';

interface TestimonialsProps {
  variant?: 'light' | 'masked';
}

const HEADING_WORDS = ['They', 'keep', 'coming', 'back.', 'That', 'says', 'it', 'all.'];

const Testimonials: React.FC<TestimonialsProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';
  const finalColor  = isMasked ? '#FFFDF8' : '#0A0A0A';

  // Auto-rotating index, synced across both layers by their own timers.
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const [headingRef, headingInView] = useInView({ threshold: 0.2, triggerOnce: false });

  const total   = testimonials.length;
  const visible = Math.min(total, 3);
  const active  = testimonials[activeIndex];

  return (
    <div id="testimonials" className="w-full px-6 md:px-16 py-24 md:py-32">
      {/* Label */}
      <p className={`${accentColor} text-xs uppercase tracking-[0.4em] avalon-bold mb-6`} style={textStyle}>
        Client Love
      </p>

      {/* Heading — same DOM in both variants */}
      <h2
        ref={isMasked ? undefined : headingRef}
        className={`${textColor} text-4xl md:text-5xl lg:text-6xl avalon-bold tracking-tight leading-[1.0] mb-10`}
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

      <div
        style={{ borderTop: '3px solid', borderTopColor: isMasked ? 'rgba(255,253,248,0.3)' : '#0A0A0A' }}
        className="pt-12"
      >
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Quote — identical DOM; opacity transition driven by key change in state */}
          <div className="flex-1 min-h-[280px]" data-mask-expand="380">
            <span
              className={`block text-6xl md:text-8xl font-bold leading-none mb-4 select-none ${accentColor}`}
              aria-hidden
              style={textStyle}
            >
              &ldquo;
            </span>
            <p
              key={active.id}
              className={`text-2xl md:text-3xl lg:text-4xl avalon-bold leading-tight ${textColor} mb-8 testimonial-fade`}
              style={textStyle}
            >
              {active.quote}
            </p>
            <div key={`m-${active.id}`} className="testimonial-fade">
              <p className={`avalon-bold text-base ${textColor}`} style={textStyle}>{active.author}</p>
              <p className={`avalon text-sm ${textColor} opacity-60`} style={textStyle}>
                {active.title}, {active.company}
              </p>
            </div>
          </div>

          {/* Avatars */}
          <div className="flex lg:flex-col gap-4 shrink-0">
            {Array.from({ length: visible }).map((_, i) => {
              const center   = Math.floor(visible / 2);
              const offset   = i - center;
              const idx      = (activeIndex + offset + total) % total;
              const t        = testimonials[idx];
              const isCenter = i === center;

              return (
                <button
                  key={t.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative transition-all duration-300 ${isCenter ? 'scale-110' : 'scale-90 opacity-50'}`}
                  data-mask-expand="260"
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden"
                    style={{
                      border: isCenter
                        ? `3px solid ${isMasked ? '#FFFDF8' : '#EB5939'}`
                        : `3px solid transparent`,
                    }}
                  >
                    <Image
                      src={t.imageUrl}
                      alt={t.author}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full grayscale"
                    />
                  </div>
                  {isCenter && (
                    <span
                      className="hidden lg:block absolute left-[-18px] top-1/2 -translate-y-1/2"
                      style={{
                        width: 0, height: 0,
                        borderTop: '7px solid transparent',
                        borderBottom: '7px solid transparent',
                        borderRight: `10px solid ${isMasked ? '#FFFDF8' : '#EB5939'}`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex gap-2 mt-10" data-mask-expand="220">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="transition-all duration-200"
              style={{
                width: i === activeIndex ? 28 : 10,
                height: 10,
                background: i === activeIndex
                  ? (isMasked ? '#FFFDF8' : '#EB5939')
                  : (isMasked ? 'rgba(255,253,248,0.3)' : 'rgba(10,10,10,0.25)'),
                border: 'none',
                borderRadius: 5,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonial-fade {
          animation: testimonial-in 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes testimonial-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
