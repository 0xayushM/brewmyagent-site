import React from 'react';

interface MarqueeProps {
  variant?: 'light' | 'masked';
  speed?: string;
}

const ITEMS = [
  'CUSTOM AI DEVELOPMENT',
  'AI AUTOMATION',
  'BRAND DESIGN',
  'WEBSITE DEVELOPMENT',
  'AI AGENTS',
  'MVP DEVELOPMENT',
  'GENERATIVE AI',
  'DATA INSIGHTS',
  'AI STRATEGY',
];

const Marquee: React.FC<MarqueeProps> = ({ variant = 'light', speed = '22s' }) => {
  const isMasked = variant === 'masked';

  const bg     = isMasked ? 'rgba(255,253,248,0.15)' : '#EB5939';
  const border = isMasked ? '3px solid rgba(255,253,248,0.3)' : '3px solid #0A0A0A';
  const txtCls = isMasked ? '' : 'text-white';
  const txtStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const dotCls = isMasked ? 'opacity-60' : 'bg-white';
  const dotStyle: React.CSSProperties = isMasked ? { background: '#FFFDF8' } : {};

  return (
    <div style={{ background: bg, borderTop: border, borderBottom: border, overflow: 'hidden' }}>
      <div className="marquee-inner py-3" style={{ animationDuration: speed }}>
        {/* Duplicate for seamless infinite loop */}
        {[0, 1].map((copy) => (
          <span key={copy} className="flex items-center gap-0">
            {ITEMS.map((item) => (
              <React.Fragment key={item + copy}>
                <span className={`${txtCls} avalon-bold uppercase tracking-widest text-sm px-6 shrink-0`} style={txtStyle}>
                  {item}
                </span>
                <span className={`${dotCls} inline-block w-2 h-2 rounded-full shrink-0`} style={dotStyle} />
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
