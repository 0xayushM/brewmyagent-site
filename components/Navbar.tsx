"use client";

import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';

// Sections in page order
const SECTIONS = ['home', 'about', 'services', 'work', 'testimonials', 'team', 'contact'] as const;
type Section = typeof SECTIONS[number];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);

  // ── Active-section detection via IntersectionObserver ───────────
  // This works correctly with GSAP ScrollSmoother because IO fires
  // based on the element's VISUAL position after transforms.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        {
          root:       null,
          rootMargin: '-40% 0px -40% 0px', // fires when section is in middle 20% of viewport
          threshold:  0,
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    // Scroll-to-top resets to home
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ── Smooth-scroll to section WITHOUT adding a hash to the URL ────
  const scrollTo = useCallback((id: string) => {
    setIsMenuOpen(false);
    const el = document.getElementById(id);
    if (!el) return;

    // Try ScrollSmoother first (GSAP). If not available, fall back to native.
    const smoother = (window as any).__gsap_smoother;
    if (smoother?.scrollTo) {
      smoother.scrollTo(el, true, 'top top');
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const isActive = (id: string) => activeSection === id;

  const navLinks = (
    <>
      {[
        { label: 'Services', id: 'services' },
        { label: 'Work',     id: 'work'     },
        { label: 'About',    id: 'about'    },
        { label: 'Contact',  id: 'contact'  },
      ].map(({ label, id }) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`nav-link relative transition-colors duration-200 avalon-bold text-sm uppercase tracking-[0.15rem] pb-1 ${
            isActive(id) ? 'text-tertiary' : 'text-foreground hover:text-tertiary'
          }`}
        >
          {label}
          {/* Active underline — thick orange bar */}
          <span
            className="absolute bottom-0 left-0 h-[3px] bg-tertiary transition-all duration-300 ease-out"
            style={{ width: isActive(id) ? '100%' : '0%' }}
          />
        </button>
      ))}
    </>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background' : 'bg-background/80 backdrop-blur-sm'
      }`}
      style={{ borderBottom: scrolled ? '3px solid #0A0A0A' : '3px solid transparent' }}
    >
      <div className="flex items-center justify-between w-full px-6 py-4 md:px-12 md:py-5">
        {/* Logo */}
        <button onClick={() => scrollTo('home')} className="flex items-center gap-3 group">
          <div className="w-8 h-8 md:w-9 md:h-9 relative">
            <Image src="/logo.png" alt="BrewMyAgent" fill className="object-contain" />
          </div>
          <span className="avalon-bold text-foreground text-lg md:text-xl tracking-tight group-hover:text-tertiary transition-colors duration-200">
            BrewMyAgent
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navLinks}
        </div>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo('contact')}
            className="group hidden md:inline-flex relative overflow-hidden items-center px-5 py-2 text-sm avalon-bold uppercase tracking-wider bg-tertiary text-white"
            style={{ border: '3px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A' }}
          >
            <span className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-[420ms] ease-[cubic-bezier(0.77,0,0.175,1)] bg-foreground" aria-hidden />
            <span className="relative z-10">Let&apos;s Talk</span>
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-foreground focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile fullscreen menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-background flex flex-col items-center justify-center space-y-8 z-40"
          style={{ borderTop: '3px solid #0A0A0A' }}
        >
          {[
            { label: 'Services', id: 'services' },
            { label: 'Work',     id: 'work'     },
            { label: 'About',    id: 'about'    },
            { label: 'Contact',  id: 'contact'  },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-3xl avalon-bold uppercase tracking-wider transition-colors duration-200 ${
                isActive(id) ? 'text-tertiary' : 'text-foreground hover:text-tertiary'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="mt-4 px-8 py-4 text-lg avalon-bold uppercase tracking-wider bg-tertiary text-white"
            style={{ border: '3px solid #0A0A0A', boxShadow: '5px 5px 0px #0A0A0A' }}
          >
            Let's Talk
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
