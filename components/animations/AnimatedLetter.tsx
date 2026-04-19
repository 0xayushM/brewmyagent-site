'use client';

import { useState, useEffect } from 'react';

interface AnimatedLetterProps {
  children: string;
  delay?: number;
  inView?: boolean;
  /**
   * When false, the letter renders in its final colour immediately and does
   * not run any colour-transition animation. The DOM structure is identical
   * to the animated version so both layers of the cursor-mask overlay line
   * up pixel-perfectly.
   */
  animate?: boolean;
  /** Final colour override (defaults to #0A0A0A). */
  finalColor?: string;
}

// Grey → Orange → Dark: exactly the Trident pattern but in BrewMyAgent brand colours
export default function AnimatedLetter({
  children,
  delay = 0,
  inView = false,
  animate = true,
  finalColor = '#0A0A0A',
}: AnimatedLetterProps) {
  const [phase, setPhase] = useState<'initial' | 'accent' | 'final'>(
    animate ? 'initial' : 'final'
  );

  useEffect(() => {
    if (!animate) {
      setPhase('final');
      return;
    }
    if (!inView) {
      setPhase('initial');
      return;
    }

    const t1 = setTimeout(() => setPhase('accent'), delay);
    const t2 = setTimeout(() => setPhase('final'), delay + 380);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [delay, inView, animate]);

  const color =
    phase === 'initial' ? '#B0B0A8'       // muted warm-grey
    : phase === 'accent' ? '#EB5939'      // BrewMyAgent orange
    : finalColor;                         // final colour (foreground black by default)

  return (
    <span
      className="inline-block"
      style={{
        color,
        transition: animate ? 'color 0.28s ease-in-out' : undefined,
      }}
    >
      {children}
    </span>
  );
}
