'use client';
import React from 'react';
import Image from 'next/image';
import company from '@/data/company.json';

interface FooterProps {
  variant?: 'light' | 'masked';
}

// ── Scroll helper ─────────────────────────────────────────────────────
function scrollTo(id: string) {
  const smoother = (window as any).__gsap_smoother;
  const el = document.getElementById(id);
  if (!el) return;
  if (smoother?.scrollTo) {
    smoother.scrollTo(el, true, 'top top');
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ── Social platform SVG icons ─────────────────────────────────────────
const SocialIcons: Record<string, React.FC<{ size?: number; color?: string }>> = {
  instagram: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill={color} stroke="none" />
    </svg>
  ),
  linkedin: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  twitter: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  youtube: ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.8 5 12 5 12 5s-4.8 0-7 .1c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9C6.8 19 12 19 12 19s4.8 0 7-.2c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8zM9.7 14.5V9.3l5.4 2.6-5.4 2.6z" />
    </svg>
  ),
};

const Footer: React.FC<FooterProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';
  const borderStyle = isMasked ? '3px solid rgba(255,253,248,0.3)' : '3px solid #0A0A0A';

  const navLinks = [
    { label: 'Services', id: 'services' },
    { label: 'Work',     id: 'work'     },
    { label: 'About',    id: 'about'    },
    { label: 'Team',     id: 'team'     },
    { label: 'Contact',  id: 'contact'  },
  ];

  const iconColor = isMasked ? '#FFFDF8' : '#0A0A0A';
  const iconHoverColor = '#EB5939';

  return (
    <footer className="w-full px-6 md:px-16 py-16" style={{ borderTop: borderStyle }}>
      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 relative">
              <Image src="/logo.png" alt="BrewMyAgent" fill className="object-contain" />
            </div>
            <span className={`avalon-bold text-xl ${textColor}`} style={textStyle}>BrewMyAgent</span>
          </div>
          <p className={`text-sm avalon leading-relaxed ${textColor} opacity-60 max-w-xs`} style={textStyle}>
            {company.shortDescription}
          </p>
        </div>

        {/* Nav */}
        <div>
          <h4 className={`text-xs uppercase tracking-[0.4em] avalon-bold ${accentColor} mb-5`} style={textStyle}>Navigation</h4>
          <ul className="space-y-3">
            {navLinks.map(link => (
              <li key={link.label}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className={`avalon-bold text-base ${textColor} hover:text-tertiary transition-colors duration-200 text-left`}
                  style={textStyle}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className={`text-xs uppercase tracking-[0.4em] avalon-bold ${accentColor} mb-5`} style={textStyle}>Connect</h4>
          <div className="space-y-3 mb-6">
            <a
              href={`mailto:${company.contact.email}`}
              className={`block avalon text-sm ${textColor} opacity-70 hover:opacity-100 hover:text-tertiary transition-all duration-200`}
              style={textStyle}
            >
              {company.contact.email}
            </a>
            <a
              href={`tel:${company.contact.phone}`}
              className={`block avalon text-sm ${textColor} opacity-70 hover:opacity-100 hover:text-tertiary transition-all duration-200`}
              style={textStyle}
            >
              {company.contact.phone}
            </a>
          </div>

          {/* Social icons */}
          <div className="flex gap-3 flex-wrap">
            {Object.entries(company.contact.social).map(([platform, url]) => {
              const IconComp = SocialIcons[platform.toLowerCase()];
              if (!IconComp) return null;
              return (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="group flex items-center justify-center transition-all duration-200"
                  style={{
                    width: 40, height: 40,
                    border: isMasked ? '2px solid rgba(255,253,248,0.4)' : '2px solid #0A0A0A',
                    boxShadow: isMasked ? 'none' : '3px 3px 0px #0A0A0A',
                    color: iconColor,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '#EB5939';
                    (e.currentTarget as HTMLElement).style.borderColor = '#EB5939';
                    (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0px #0A0A0A';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.borderColor = isMasked ? 'rgba(255,253,248,0.4)' : '#0A0A0A';
                    (e.currentTarget as HTMLElement).style.boxShadow = isMasked ? 'none' : '3px 3px 0px #0A0A0A';
                    (e.currentTarget as HTMLElement).style.color = iconColor;
                  }}
                >
                  <IconComp size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
        style={{ borderTop: '2px solid', borderTopColor: isMasked ? 'rgba(255,253,248,0.2)' : '#0A0A0A' }}
      >
        <p className={`text-xs avalon ${textColor} opacity-50`} style={textStyle}>
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </p>
        <p className={`text-xs avalon ${textColor} opacity-50`} style={textStyle}>
          Built with ❤️ in Mumbai, India
        </p>
      </div>
    </footer>
  );
};

export default Footer;
