'use client';

import React from 'react';
import Image from 'next/image';

interface MugFillProps {
  /** 'masked' keeps the mug visible but plays no motion so the mask layer
   * aligns pixel-perfectly with the light layer. */
  variant?: 'light' | 'masked';
}

/**
 * Continuous-fill animation of the BrewMyAgent logo.svg (a coffee mug).
 *
 * Two stacked copies of the logo — one ghosted, one vibrant — are composed
 * on top of each other. The vibrant copy is clipped with a bottom-up
 * `inset()` clip-path that slowly rises and falls on a loop, giving the
 * illusion that the mug is being filled with orange espresso.
 *
 * Ambient steam curls rise from the top, and a few bubbles float up to sell
 * the "just-brewed" effect.
 */
const MugFill: React.FC<MugFillProps> = ({ variant = 'light' }) => {
  const isMasked = variant === 'masked';

  return (
    <div
      className="relative w-[260px] md:w-[320px] lg:w-[360px] aspect-[460/568] select-none"
      aria-hidden
      data-mask-expand="360"
    >
      {/* ── Steam curls (light variant only) ── */}
      {!isMasked && (
        <div className="absolute inset-x-0 -top-10 h-24 pointer-events-none mug-steam-wrap">
          <span className="mug-steam mug-steam-1" />
          <span className="mug-steam mug-steam-2" />
          <span className="mug-steam mug-steam-3" />
        </div>
      )}

      {/* ── Faded/empty mug silhouette ── */}
      <div
        className="absolute inset-0"
        style={{
          opacity: isMasked ? 0.25 : 0.14,
          filter: isMasked ? 'none' : 'grayscale(1)',
        }}
      >
        <Image
          src="/logo.svg"
          alt=""
          fill
          priority={false}
          sizes="(min-width: 1024px) 360px, 260px"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* ── Vibrant mug, clipped from the bottom up to create the fill ── */}
      <div className={`absolute inset-0 ${isMasked ? 'mug-fill-static' : 'mug-fill-clip'}`}>
        <Image
          src="/logo.svg"
          alt="BrewMyAgent mug filling with coffee"
          fill
          priority={false}
          sizes="(min-width: 1024px) 360px, 260px"
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* ── Foam / crema line that tracks the liquid level ── */}
      {!isMasked && (
        <div className="absolute inset-0 pointer-events-none mug-foam-track">
          <div className="mug-foam-line" />
        </div>
      )}

      {/* ── Rising bubbles (light variant only) ── */}
      {!isMasked && (
        <div className="absolute inset-0 pointer-events-none mug-bubbles">
          <span className="mug-bubble mug-bubble-1" />
          <span className="mug-bubble mug-bubble-2" />
          <span className="mug-bubble mug-bubble-3" />
          <span className="mug-bubble mug-bubble-4" />
        </div>
      )}

      <style jsx>{`
        /* ── Mug fill clip — continuous loop ── */
        .mug-fill-clip {
          animation: mug-fill 5.2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
          clip-path: inset(100% 0 0 0);
          will-change: clip-path;
        }
        /* The masked layer stays completely filled so the overlay reveal is
         * always showing the vibrant mug, matching the base layer outline. */
        .mug-fill-static {
          clip-path: inset(0 0 0 0);
        }

        @keyframes mug-fill {
          0%   { clip-path: inset(100% 0 0 0); }
          45%  { clip-path: inset(10% 0 0 0); }
          55%  { clip-path: inset(10% 0 0 0); }
          100% { clip-path: inset(100% 0 0 0); }
        }

        /* ── Foam / crema line — follows the liquid level ── */
        .mug-foam-track {
          animation: foam-follow 5.2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
          will-change: transform;
        }
        .mug-foam-line {
          position: absolute;
          left: 18%;
          right: 18%;
          top: 0;
          height: 6px;
          background: #FFF5E6;
          border-radius: 999px;
          box-shadow: 0 1px 0 rgba(0, 0, 0, 0.18);
          transform: scaleX(0.9);
          opacity: 0.85;
        }
        @keyframes foam-follow {
          0%   { transform: translateY(100%); opacity: 0; }
          10%  { opacity: 0.9; }
          45%  { transform: translateY(10%); opacity: 1; }
          55%  { transform: translateY(10%); opacity: 1; }
          90%  { opacity: 0.9; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        /* ── Steam curls ── */
        .mug-steam-wrap { overflow: visible; }
        .mug-steam {
          position: absolute;
          bottom: 0;
          width: 10px;
          height: 60px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(10, 10, 10, 0) 0%,
            rgba(10, 10, 10, 0.22) 60%,
            rgba(10, 10, 10, 0.35) 100%
          );
          filter: blur(6px);
          opacity: 0;
          transform-origin: 50% 100%;
        }
        .mug-steam-1 { left: 40%; animation: steam 4s ease-in-out infinite; }
        .mug-steam-2 { left: 52%; animation: steam 4.6s ease-in-out infinite 0.8s; }
        .mug-steam-3 { left: 60%; animation: steam 5.2s ease-in-out infinite 1.6s; }
        @keyframes steam {
          0%   { transform: translateY(20px) scaleX(0.6) rotate(0deg); opacity: 0; }
          30%  { opacity: 0.55; }
          70%  { opacity: 0.35; }
          100% { transform: translateY(-50px) scaleX(1.1) rotate(8deg); opacity: 0; }
        }

        /* ── Bubbles drifting up inside the liquid ── */
        .mug-bubble {
          position: absolute;
          bottom: 12%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FFF5E6;
          opacity: 0;
          box-shadow: inset -1px -1px 0 rgba(255, 255, 255, 0.6);
        }
        .mug-bubble-1 { left: 34%; width: 8px;  height: 8px;  animation: bubble 3.2s ease-in  infinite 0.2s; }
        .mug-bubble-2 { left: 44%; width: 12px; height: 12px; animation: bubble 3.6s ease-in  infinite 1.0s; }
        .mug-bubble-3 { left: 52%; width: 6px;  height: 6px;  animation: bubble 3.0s ease-in  infinite 1.6s; }
        .mug-bubble-4 { left: 60%; width: 10px; height: 10px; animation: bubble 4.0s ease-in  infinite 2.2s; }
        @keyframes bubble {
          0%   { transform: translateY(0)    scale(0.4); opacity: 0; }
          20%  { opacity: 0.85; }
          100% { transform: translateY(-140px) scale(1);   opacity: 0; }
        }

        /* Respect users who ask for reduced motion. */
        @media (prefers-reduced-motion: reduce) {
          .mug-fill-clip,
          .mug-foam-track,
          .mug-steam,
          .mug-bubble {
            animation: none !important;
          }
          .mug-fill-clip { clip-path: inset(20% 0 0 0); }
          .mug-foam-track { transform: translateY(20%); }
        }
      `}</style>
    </div>
  );
};

export default MugFill;
