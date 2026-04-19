import { useLayoutEffect, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Geist, Geist_Mono, Bruno_Ace } from "next/font/google";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useMaskSize } from '../utils/useMaskSize';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import PageContent from '@/components/PageContent';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ['100','200','300','400','500','600','700','800','900'],
});
const brunoAce = Bruno_Ace({
  variable: "--font-bruno-ace",
  subsets: ["latin"],
  weight: '400',
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Mask size logic ───────────────────────────────────────────────────
// Sizes by element type:
const MASK_SIZES = {
  heading:   400,   // h1-h4
  cta:       300,   // buttons, <a>
  media:     250,   // img, video
  text:      180,   // p, li, span with text
  section:   140,   // cards, sections
  default:   22,    // empty/background
} as const;

function getMaskSize(el: HTMLElement): number {
  // Walk up the tree looking for an explicit override. We respect two
  // attributes:
  //   • data-mask-size   — locks the mask to an exact pixel size on hover
  //   • data-mask-expand — expands the mask to the given size when the
  //                         cursor is anywhere inside this element's subtree.
  //                         This is what lets a heading still expand even
  //                         when the cursor is hovering a per-letter
  //                         <span class="inline-block"> (which is a <span>,
  //                         not an <h2>, and would otherwise fall through to
  //                         the text-size tier).
  let node: HTMLElement | null = el;
  while (node) {
    if (node.hasAttribute?.('data-mask-size')) {
      return parseInt(node.getAttribute('data-mask-size')!, 10);
    }
    if (node.hasAttribute?.('data-mask-expand')) {
      return parseInt(node.getAttribute('data-mask-expand')!, 10);
    }
    if (node.id === 'smooth-content') break;
    node = node.parentElement;
  }

  const tag = el.tagName.toLowerCase();
  if (['h1','h2','h3','h4'].includes(tag))       return MASK_SIZES.heading;
  if (['h5','h6'].includes(tag))                  return MASK_SIZES.text;
  if (tag === 'button' || tag === 'a')            return MASK_SIZES.cta;
  if (tag === 'img' || tag === 'video')           return MASK_SIZES.media;
  if (['p','li','label','span'].includes(tag) && el.textContent?.trim())
                                                  return MASK_SIZES.text;
  if (['input','select','textarea'].includes(tag)) return MASK_SIZES.cta;

  // Check parent context — if inside a card/section with content
  const nearContent = el.closest('section, article, footer, form, [class*="card"], [class*="row"], [class*="panel"]');
  if (nearContent) return MASK_SIZES.section;

  return MASK_SIZES.default;
}

export default function Home() {
  const main     = useRef<HTMLDivElement>(null);
  const smoother = useRef<ScrollSmoother | null>(null);

  // ── Mask size ─────────────────────────────────────────────────────────
  const { maskSize, setCustomMaskSize } = useMaskSize({
    defaultSize:        22,
    hoveredSize:        400,
    transitionDuration: 0.3,
  });

  // ── framer-motion motion values for mask position ─────────────────────
  const rawX    = useMotionValue(-200);
  const rawY    = useMotionValue(-200);
  const rawSize = useMotionValue(22);

  // Tight spring so mask tracks cursor accurately
  const springX    = useSpring(rawX,    { stiffness: 700, damping: 42, mass: 0.35 });
  const springY    = useSpring(rawY,    { stiffness: 700, damping: 42, mass: 0.35 });
  const springSize = useSpring(rawSize, { stiffness: 220, damping: 30, mass: 0.35 });

  useEffect(() => { rawSize.set(maskSize); }, [maskSize, rawSize]);

  // Mask position string (center the circle on the cursor)
  const maskPosition = useTransform(
    [springX, springY, springSize],
    ([x, y, s]: number[]) => `${x - s / 2}px ${y - s / 2}px`
  );
  const maskSizeStr = useTransform(springSize, (s: number) => `${s}px ${s}px`);

  // ── GSAP ScrollSmoother only ─────────────────────────────────────────
  // Hero pin/fade-out animation is intentionally removed — it injects a
  // pin-spacer element in the LIGHT layer only, which breaks pixel
  // alignment between the masked overlay and the base page below.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    smoother.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
    });
    (window as any).__gsap_smoother = smoother.current;

    return () => {
      smoother.current?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ── Mouse tracking + scroll-offset correction ─────────────────────────
  // The .mask div lives inside #smooth-content which GSAP translates by
  // -scrollTop. So mask-position Y must be clientY + smootherScrollTop.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let clientX = -200;
    let clientY = -200;

    const onMove = (e: MouseEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      rawX.set(clientX);
      rawY.set(clientY + (smoother.current?.scrollTop() ?? 0));
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Keep Y in sync while scrolling without mouse movement
    const tick = () => {
      rawY.set(clientY + (smoother.current?.scrollTop() ?? 0));
    };
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(tick);
    };
  }, [rawX, rawY]);

  // ── Smart mask-size based on hovered element type ─────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return;
      setCustomMaskSize(getMaskSize(el));
    };
    document.addEventListener('mouseover', handler, { passive: true });
    return () => document.removeEventListener('mouseover', handler);
  }, [setCustomMaskSize]);

  return (
    <>
      <Navbar />
      <div id="smooth-wrapper" ref={main}>
        <div id="smooth-content">
          <div className={`${geistSans.variable} ${brunoAce.variable} ${geistMono.variable}`}>
            <div className="relative">
              {/* ── Orange masked lens ── */}
              <motion.div
                className="hidden md:block mask absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                style={{
                  WebkitMaskPosition: maskPosition,
                  maskPosition,
                  WebkitMaskSize: maskSizeStr,
                  maskSize: maskSizeStr,
                } as any}
              >
                <PageContent variant="masked" />
              </motion.div>

              {/* ── Normal light page ── */}
              <PageContent variant="unmasked" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
