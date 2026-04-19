import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Geist, Bruno_Ace } from 'next/font/google';
import About from '@/components/About';
import Team from '@/components/Team';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import company from '@/data/company.json';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const brunoAce  = Bruno_Ace({ variable: '--font-bruno-ace', subsets: ['latin'], weight: '400' });

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — BrewMyAgent</title>
        <meta name="description" content="Learn about BrewMyAgent — our story, our team, and why we build the way we do." />
      </Head>

      <div className={`${geistSans.variable} ${brunoAce.variable} bg-background min-h-screen`}>
        {/* ── Navbar ── */}
        <nav
          className="fixed top-0 w-full z-50 bg-background px-6 md:px-16 py-5 flex items-center justify-between"
          style={{ borderBottom: '3px solid #0A0A0A' }}
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 relative">
              <Image src="/logo.png" alt="BrewMyAgent" fill className="object-contain" />
            </div>
            <span className="avalon-bold text-foreground text-xl tracking-tight group-hover:text-tertiary transition-colors duration-200">
              BrewMyAgent
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/#services" className="text-sm avalon-bold uppercase tracking-wider text-foreground hover:text-tertiary transition-colors duration-200">Services</Link>
            <Link href="/#work"     className="text-sm avalon-bold uppercase tracking-wider text-foreground hover:text-tertiary transition-colors duration-200">Work</Link>
            <Link href="/about"     className="text-sm avalon-bold uppercase tracking-wider text-tertiary border-b-2 border-tertiary">About</Link>
            <Link
              href="/contact"
              className="px-5 py-2 text-sm avalon-bold uppercase tracking-wider bg-tertiary text-white"
              style={{ border: '3px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A' }}
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* ── Hero banner ── */}
        <section
          className="pt-32 pb-20 px-6 md:px-16"
          style={{ borderBottom: '3px solid #0A0A0A' }}
        >
          <p className="text-xs text-tertiary uppercase tracking-[0.4em] avalon-bold mb-6">About Us</p>
          <h1 className="text-6xl md:text-8xl lg:text-[10vw] avalon-bold text-foreground leading-[0.9] tracking-tighter mb-8">
            Built for the <br />
            <span className="text-tertiary">AI era.</span>
          </h1>
          <p className="text-xl md:text-2xl avalon text-foreground opacity-70 max-w-2xl leading-relaxed">
            {company.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {company.stats.map(stat => (
              <div
                key={stat.label}
                className="p-6"
                style={{ border: '3px solid #0A0A0A', boxShadow: '5px 5px 0px #0A0A0A', background: '#FFF5E6' }}
              >
                <div className="text-4xl font-bold avalon-bold text-tertiary">{stat.value}</div>
                <div className="text-xs uppercase tracking-widest text-foreground opacity-60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── About content ── */}
        <div style={{ borderBottom: '3px solid #0A0A0A' }}>
          <About variant="light" />
        </div>

        {/* ── Team ── */}
        <div style={{ borderBottom: '3px solid #0A0A0A' }}>
          <Team variant="light" />
        </div>

        {/* ── Testimonials ── */}
        <div style={{ borderBottom: '3px solid #0A0A0A' }}>
          <Testimonials variant="light" />
        </div>

        {/* ── CTA ── */}
        <section className="px-6 md:px-16 py-24 flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderBottom: '3px solid #0A0A0A' }}>
          <h2 className="text-4xl md:text-6xl avalon-bold text-foreground leading-tight">
            Ready to work <span className="text-tertiary">together?</span>
          </h2>
          <Link
            href="/contact"
            className="shrink-0 px-8 py-4 text-base avalon-bold uppercase tracking-wider bg-tertiary text-white"
            style={{ border: '3px solid #0A0A0A', boxShadow: '6px 6px 0px #0A0A0A' }}
          >
            Start a Project →
          </Link>
        </section>

        <Footer variant="light" />
      </div>
    </>
  );
}
