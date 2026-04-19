'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface TeamPhotoCardProps {
  src: string;
  name: string;
}

/**
 * Chamfered polygon photo card — ported from Trident's PhotoCard,
 * colours adapted to BrewMyAgent orange (#EB5939).
 */
export default function TeamPhotoCard({ src, name }: TeamPhotoCardProps) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect();
      setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const C = w > 0 ? Math.round(Math.max(32, Math.min(w * 0.13, 52))) : 0;

  // Chamfered polygon: cut top-right + bottom-left corners
  const pts        = w > 0 ? `0,0 ${w-C},0 ${w},${C} ${w},${h} ${C},${h} 0,${h-C}` : '';
  const shadowPts  = w > 0 ? `10,10 ${w-C+10},10 ${w+10},${C+10} ${w+10},${h+10} ${C+10},${h+10} 10,${h-C+10}` : '';
  const cssClip    = w > 0 ? `polygon(0 0, calc(100% - ${C}px) 0, 100% ${C}px, 100% 100%, ${C}px 100%, 0 calc(100% - ${C}px))` : undefined;
  const orange     = '#EB5939';

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ aspectRatio: '3/4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Shadow plate */}
      {w > 0 && (
        <svg
          className="absolute pointer-events-none"
          style={{ top: 0, left: 0, width: w + 14, height: h + 14, overflow: 'visible', zIndex: 0,
                   opacity: hovered ? 0.55 : 0.15, transition: 'opacity 0.4s ease' }}
          aria-hidden
        >
          <polygon points={shadowPts} fill="none" stroke={orange} strokeWidth="1" />
        </svg>
      )}

      {/* Image with clip-path */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: cssClip }}>
        <Image
          src={src}
          alt={name}
          fill
          className="object-cover object-top"
          style={{
            filter:    hovered ? 'grayscale(0%) contrast(1.03)' : 'grayscale(80%) contrast(1.06)',
            transform: hovered ? 'scale(1.04)' : 'scale(1.0)',
            transition: 'filter 0.5s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
            transformOrigin: 'top center',
          }}
          sizes="(max-width: 768px) 80vw, 28vw"
          quality={90}
        />
        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, transparent 45%)' }}
        />
      </div>

      {/* SVG overlay: chamfer border + accent details */}
      {w > 0 && (
        <svg
          className="absolute inset-0 pointer-events-none overflow-visible"
          width={w} height={h}
          aria-hidden style={{ zIndex: 10 }}
        >
          {/* Main chamfered border */}
          <polygon
            points={pts}
            fill="none"
            stroke={hovered ? orange : 'rgba(200,195,185,0.65)'}
            strokeWidth={hovered ? 1.5 : 1}
            style={{ transition: 'stroke 0.35s ease, stroke-width 0.3s ease' }}
          />

          {/* Orange fill triangle at top-right chamfer */}
          <polygon
            points={`${w-C},0 ${w},0 ${w},${C}`}
            fill={hovered ? orange : 'rgba(235,89,57,0.45)'}
            style={{ transition: 'fill 0.3s ease' }}
          />

          {/* Ghost outline inside chamfer */}
          <polygon
            points={`${w-C+6},0 ${w},0 ${w},${C-6}`}
            fill="none"
            stroke={hovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.14)'}
            strokeWidth="0.8"
            style={{ transition: 'stroke 0.3s ease' }}
          />

          {/* Bottom-left chamfer fill */}
          <polygon
            points={`0,${h-C} ${C},${h} 0,${h}`}
            fill={hovered ? 'rgba(235,89,57,0.18)' : 'rgba(0,0,0,0.14)'}
            style={{ transition: 'fill 0.35s ease' }}
          />

          {/* Vertex accent dots */}
          <circle cx={w-C} cy={0}   r={2.5} fill={orange} opacity={hovered ? 1 : 0.4} style={{ transition: 'opacity 0.3s' }} />
          <circle cx={w}   cy={C}   r={2.5} fill={orange} opacity={hovered ? 1 : 0.4} style={{ transition: 'opacity 0.3s' }} />
          <circle cx={C}   cy={h}   r={2.5} fill={orange} opacity={hovered ? 0.8 : 0.22} style={{ transition: 'opacity 0.3s' }} />
          <circle cx={0}   cy={h-C} r={2.5} fill={orange} opacity={hovered ? 0.8 : 0.22} style={{ transition: 'opacity 0.3s' }} />

          {/* Scan-line at 72% height — appears on hover */}
          <line
            x1={0} y1={Math.round(h * 0.72)} x2={w} y2={Math.round(h * 0.72)}
            stroke={`rgba(235,89,57,0.35)`} strokeWidth="1" strokeDasharray="4 6"
            opacity={hovered ? 1 : 0}
            style={{ transition: 'opacity 0.4s ease' }}
          />

          {/* Top-left bracket */}
          <path d={`M0 14 L0 0 L14 0`} fill="none"
            stroke={hovered ? orange : 'rgba(235,89,57,0.35)'}
            strokeWidth="1.5" strokeLinecap="square"
            style={{ transition: 'stroke 0.3s ease' }}
          />

          {/* Bottom-right bracket */}
          <path d={`M${w} ${h-14} L${w} ${h} L${w-14} ${h}`} fill="none"
            stroke={hovered ? orange : 'rgba(235,89,57,0.35)'}
            strokeWidth="1.5" strokeLinecap="square"
            style={{ transition: 'stroke 0.3s ease' }}
          />
        </svg>
      )}
    </div>
  );
}
