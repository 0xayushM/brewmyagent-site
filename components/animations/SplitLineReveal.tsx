'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

type SplitMode = 'lines' | 'words' | 'chars';

interface SplitLineRevealProps {
  children: string;
  className?: string;
  mode?: SplitMode;
  delay?: number;
  /** When true, animation fires on scroll. When false, fires immediately on mount. */
  triggerOnScroll?: boolean;
  as?: keyof HTMLElementTagNameMap;
}

const DEFAULT_CFG: Record<SplitMode, { duration: number; stagger: number }> = {
  lines: { duration: 0.9, stagger: 0.09 },
  words: { duration: 0.65, stagger: 0.06 },
  chars: { duration: 0.4,  stagger: 0.008 },
};

export default function SplitLineReveal({
  children,
  className = '',
  mode = 'lines',
  delay = 0,
  triggerOnScroll = true,
  as = 'div',
}: SplitLineRevealProps) {
  const wrapperRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const node = wrapperRef.current;
    if (!node) return;

    const { duration, stagger } = DEFAULT_CFG[mode];

    const split = SplitText.create(node, {
      type: 'lines,words,chars',
      linesClass: '++bma-split-line',
    });

    const targets =
      mode === 'lines' ? split.lines ?? []
    : mode === 'words' ? split.words ?? []
    : split.chars  ?? [];

    if (!targets.length) { split.revert(); return; }

    gsap.set(targets, { yPercent: 108 });

    const tween = gsap.to(targets, {
      yPercent: 0,
      duration,
      stagger,
      ease: 'power4.out',
      delay,
      scrollTrigger: triggerOnScroll ? {
        trigger: node,
        // Use GSAP smoother as scroller if available
        scroller: (window as any).__gsap_smoother ? '#smooth-wrapper' : window,
        start: 'top 88%',
      } : undefined,
    });

    return () => { tween.kill(); split.revert(); };
  }, [mode, delay, triggerOnScroll]);

  const Tag = as as any;
  return <Tag ref={wrapperRef} className={className}>{children}</Tag>;
}
