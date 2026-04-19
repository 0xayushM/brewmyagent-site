import React from 'react';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Team from './Team';
import Contact from './Contact';
import Footer from './Footer';
import Marquee from './Marquee';

interface PageContentProps {
  variant: 'masked' | 'unmasked';
}

/**
 * PageContent renders the full landing page in either:
 *   'unmasked' — normal light neobrutalism theme (visible base page)
 *   'masked'   — orange (#EB5939) background version revealed by the cursor lens
 *
 * Every section delegates to its component's own `variant` prop so the masked
 * layer is pixel-identical to the light layer — this ensures the circular mask
 * always reveals matching content regardless of scroll position.
 */
const PageContent: React.FC<PageContentProps> = ({ variant }) => {
  const isMasked = variant === 'masked';
  const sec      = `w-full ${isMasked ? '' : 'bg-background'}`;

  const divider = (
    <div style={{ borderTop: '3px solid', borderColor: isMasked ? 'rgba(255,253,248,0.18)' : '#0A0A0A' }} />
  );

  return (
    <div style={{ width: '100%', background: isMasked ? '#EB5939' : 'transparent' }}>

      {/* ── HERO ── */}
      <section id={isMasked ? undefined : 'home'} className={`hero-section${isMasked ? '-masked' : ''} ${sec} min-h-screen flex flex-col`}>
        <div className={`hero-content${isMasked ? '-masked' : ''} flex-1 flex`}>
          <Hero variant={isMasked ? 'masked' : 'light'} />
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee variant={isMasked ? 'masked' : 'light'} />

      {/* ── ABOUT ── */}
      {divider}
      <section className={sec}>
        <About variant={isMasked ? 'masked' : 'light'} />
      </section>

      {/* ── SERVICES ── */}
      {divider}
      <section className={sec}>
        <Services variant={isMasked ? 'masked' : 'light'} />
      </section>

      {/* ── PROJECTS ── */}
      {divider}
      <section className={sec}>
        <Projects variant={isMasked ? 'masked' : 'light'} />
      </section>

      {/* ── TESTIMONIALS ── */}
      {divider}
      <section className={sec}>
        <Testimonials variant={isMasked ? 'masked' : 'light'} />
      </section>

      {/* ── TEAM ── */}
      {divider}
      <section className={sec}>
        <Team variant={isMasked ? 'masked' : 'light'} />
      </section>

      {/* ── MARQUEE (reverse) ── */}
      <Marquee variant={isMasked ? 'masked' : 'light'} speed="30s" />

      {/* ── CONTACT — uses component variant for layout-identical masked layer ── */}
      {divider}
      <section className={sec}>
        <Contact variant={isMasked ? 'masked' : 'light'} />
      </section>

      {/* ── FOOTER ── */}
      <Footer variant={isMasked ? 'masked' : 'light'} />
    </div>
  );
};

export default PageContent;
