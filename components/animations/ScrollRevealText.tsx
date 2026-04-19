'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Char-by-char colour sweep as the section scrolls into view.
 * Grey → Orange (#EB5939) → Dark (#0A0A0A)
 * Works with GSAP ScrollSmoother because getBoundingClientRect() returns
 * the visual (post-transform) position.
 */
export default function ScrollRevealText({ text, className = '', containerRef }: ScrollRevealTextProps) {
  const [progress, setProgress] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (!textRef.current) return;
      const textRect = textRef.current.getBoundingClientRect();
      const wh = window.innerHeight;

      if (textRect.top > wh * 0.85 || textRect.bottom < wh * 0.15) {
        setProgress(0);
        return;
      }

      const enter   = wh * 0.85;
      const center  = wh * 0.45;
      const p = Math.max(0, Math.min(1, (enter - textRect.top) / (enter - center)));
      setProgress(p);
    };

    // Listen on both window scroll AND the GSAP ticker for ScrollSmoother compat
    window.addEventListener('scroll', update, { passive: true });
    // Also run on every GSAP tick to catch smoother updates
    const { gsap } = require('gsap');
    gsap.ticker.add(update);

    update();
    return () => {
      window.removeEventListener('scroll', update);
      gsap.ticker.remove(update);
    };
  }, []);

  const chars   = text.split('');
  const total   = chars.length;
  const sweep   = progress * total * 2;

  return (
    <div ref={textRef} className={className}>
      {chars.map((ch, i) => {
        const color =
          i < sweep - 8  ? '#0A0A0A'   // already swept → dark
        : i < sweep      ? '#EB5939'   // sweeping → orange
        :                  '#8A8880';  // not yet   → warm-grey
        return (
          <span key={i} style={{ color, transition: 'color 0.12s ease-in-out' }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
}
