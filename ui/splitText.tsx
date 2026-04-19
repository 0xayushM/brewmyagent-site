import React, { useRef, useEffect } from "react";

export interface SplitTextProps {
  text?: string; // optional now
  children?: React.ReactNode; // <== added this
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  children,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const cleanupRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el || animationCompletedRef.current) return;

    const initAnimation = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { SplitText: GSAPSplitText } = await import("gsap/SplitText");
      gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

      const absoluteLines = splitType === "lines";
      if (absoluteLines) el.style.position = "relative";

      const splitter = new GSAPSplitText(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line",
      });

      let targets: Element[];
      switch (splitType) {
        case "lines":
          targets = splitter.lines;
          break;
        case "words":
          targets = splitter.words;
          break;
        case "words, chars":
          targets = [...splitter.words, ...splitter.chars];
          break;
        default:
          targets = splitter.chars;
      }

      targets.forEach((t) => {
        (t as HTMLElement).style.willChange = "transform, opacity";
      });

      const startPct = (1 - threshold) * 100;
      const m = /^(-?\d+)px$/.exec(rootMargin);
      const raw = m ? parseInt(m[1], 10) : 0;
      const sign = raw < 0 ? `-=${Math.abs(raw)}px` : `+=${raw}px`;
      const start = `top ${startPct}%${sign}`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
          once: true,
        },
        smoothChildTiming: true,
        onComplete: () => {
          animationCompletedRef.current = true;
          gsap.set(targets, {
            ...to,
            clearProps: "willChange",
            immediateRender: true,
          });
          onLetterAnimationComplete?.();
        },
      });

      tl.set(targets, { ...from, immediateRender: false, force3D: true });
      tl.to(targets, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
      });

      cleanupRef.current = () => {
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
        gsap.killTweensOf(targets);
        splitter.revert();
      };
    };

    initAnimation();

    return () => {
      cleanupRef.current();
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent overflow-hidden inline-block whitespace-normal ${className}`}
      style={{
        textAlign,
        wordWrap: "break-word",
      }}
    >
      {children || text}
    </p>
  );
};

export default SplitText;
