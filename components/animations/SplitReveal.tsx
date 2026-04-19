'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface SplitRevealProps {
  text: string;
  /** When true → slide in; false → slide out (for swapping between items) */
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Lines slide in from yPercent:110 when active=true, out to yPercent:-150 when false.
 * Ported from Trident. Used by the Benefits/Projects scroll-driven section.
 */
export default function SplitReveal({ text, active = true, className = '', style }: SplitRevealProps) {
  const ref       = useRef<HTMLDivElement>(null);
  const splitRef  = useRef<InstanceType<typeof SplitText> | null>(null);
  const tweenRef  = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    splitRef.current = SplitText.create(ref.current, { type: 'lines,words,chars', mask: 'lines' });
    if (splitRef.current.lines) gsap.set(splitRef.current.lines, { yPercent: 110 });
    return () => { tweenRef.current?.kill(); splitRef.current?.revert(); };
  }, []);

  useEffect(() => {
    const lines = splitRef.current?.lines;
    if (!lines?.length) return;
    tweenRef.current?.kill();

    if (active) {
      gsap.set(lines, { yPercent: 110 });
      tweenRef.current = gsap.to(lines, {
        yPercent: 0, duration: 1.2, stagger: 0.08, ease: 'power4.out', overwrite: true,
      });
    } else {
      tweenRef.current = gsap.to(lines, {
        yPercent: -140, duration: 1.1, stagger: 0.07, ease: 'power2.inOut', overwrite: true,
      });
    }
  }, [active]);

  return <div ref={ref} className={className} style={style}>{text}</div>;
}
