'use client';

import AnimatedLetter from './AnimatedLetter';

interface AnimatedWordProps {
  children: string;
  delay?: number;
  inView?: boolean;
  /** When false, words render statically in finalColor — used by the masked layer. */
  animate?: boolean;
  /** Final colour override (forwarded to AnimatedLetter). */
  finalColor?: string;
}

export default function AnimatedWord({
  children,
  delay = 0,
  inView = false,
  animate = true,
  finalColor,
}: AnimatedWordProps) {
  const letters = children.split('');
  return (
    <span className="inline-block">
      {letters.map((letter, i) => (
        <AnimatedLetter
          key={i}
          delay={delay + i * 70}
          inView={inView}
          animate={animate}
          finalColor={finalColor}
        >
          {letter}
        </AnimatedLetter>
      ))}
    </span>
  );
}
