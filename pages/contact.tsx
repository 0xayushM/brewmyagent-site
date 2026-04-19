import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { Geist, Bruno_Ace } from 'next/font/google';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import company from '@/data/company.json';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const brunoAce  = Bruno_Ace({ variable: '--font-bruno-ace', subsets: ['latin'], weight: '400' });

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact — BrewMyAgent</title>
        <meta name="description" content="Get in touch with BrewMyAgent. Let's build something brilliant together." />
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
            <Link href="/about"     className="text-sm avalon-bold uppercase tracking-wider text-foreground hover:text-tertiary transition-colors duration-200">About</Link>
            <Link
              href="/contact"
              className="px-5 py-2 text-sm avalon-bold uppercase tracking-wider bg-tertiary text-white border-b-0"
              style={{ border: '3px solid #0A0A0A', boxShadow: '4px 4px 0px #EB5939' }}
            >
              Contact
            </Link>
          </div>
        </nav>

        {/* ── Hero banner ── */}
        <section
          className="pt-32 pb-16 px-6 md:px-16"
          style={{ borderBottom: '3px solid #0A0A0A' }}
        >
          <p className="text-xs text-tertiary uppercase tracking-[0.4em] avalon-bold mb-6">Contact</p>
          <h1 className="text-6xl md:text-8xl lg:text-[10vw] avalon-bold text-foreground leading-[0.9] tracking-tighter">
            Let's brew <br />
            <span className="text-tertiary">something.</span>
          </h1>
        </section>

        {/* ── Quick links row ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3"
          style={{ borderBottom: '3px solid #0A0A0A' }}
        >
          <a
            href={`mailto:${company.contact.email}`}
            className="flex flex-col px-8 py-8 group hover:bg-tertiary transition-colors duration-200"
            style={{ borderRight: '3px solid #0A0A0A' }}
          >
            <span className="text-xs avalon-bold uppercase tracking-widest text-foreground opacity-50 group-hover:text-white group-hover:opacity-70 mb-2">Email us</span>
            <span className="text-xl avalon-bold text-foreground group-hover:text-white transition-colors duration-200">{company.contact.email}</span>
          </a>
          <a
            href={`tel:${company.contact.phone}`}
            className="flex flex-col px-8 py-8 group hover:bg-tertiary transition-colors duration-200"
            style={{ borderRight: '3px solid #0A0A0A' }}
          >
            <span className="text-xs avalon-bold uppercase tracking-widest text-foreground opacity-50 group-hover:text-white group-hover:opacity-70 mb-2">Call us</span>
            <span className="text-xl avalon-bold text-foreground group-hover:text-white transition-colors duration-200">{company.contact.phone}</span>
          </a>
          <div className="flex flex-col px-8 py-8">
            <span className="text-xs avalon-bold uppercase tracking-widest text-foreground opacity-50 mb-2">Based in</span>
            <span className="text-xl avalon-bold text-foreground">{company.contact.address}</span>
          </div>
        </div>

        {/* ── Full contact form + info ── */}
        <Contact variant="light" />

        {/* ── Social links ── */}
        <section
          className="px-6 md:px-16 py-16"
          style={{ borderTop: '3px solid #0A0A0A', borderBottom: '3px solid #0A0A0A' }}
        >
          <p className="text-xs text-tertiary uppercase tracking-[0.4em] avalon-bold mb-8">Follow along</p>
          <div className="flex flex-wrap gap-4">
            {Object.entries(company.contact.social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 avalon-bold uppercase tracking-wider text-sm text-foreground hover:bg-tertiary hover:text-white hover:border-tertiary transition-all duration-200"
                style={{ border: '3px solid #0A0A0A', boxShadow: '4px 4px 0px #0A0A0A' }}
              >
                {platform} →
              </a>
            ))}
          </div>
        </section>

        <Footer variant="light" />
      </div>
    </>
  );
}
