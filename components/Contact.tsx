'use client';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { AnimatedWord } from './animations';
import company from '@/data/company.json';

interface ContactProps {
  variant?: 'light' | 'masked';
}

// "Let's brew something brilliant." split into words
const HEADING_WORDS = ["Let's", 'brew', 'something', 'brilliant.'];

const Contact: React.FC<ContactProps> = ({ variant = 'light' }) => {
  const isMasked    = variant === 'masked';
  const textColor   = isMasked ? '' : 'text-foreground';
  const textStyle: React.CSSProperties = isMasked ? { color: '#FFFDF8' } : {};
  const accentColor = isMasked ? '' : 'text-tertiary';

  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });
  const [sent, setSent]  = useState(false);

  const [headingRef, headingInView] = useInView({ threshold: 0.2, triggerOnce: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: '3px solid',
    borderColor: isMasked ? 'rgba(255,253,248,0.5)' : '#0A0A0A',
    color: isMasked ? '#FFFDF8' : '#0A0A0A',
    outline: 'none',
    width: '100%',
    padding: '12px 16px',
    fontSize: '1rem',
    fontFamily: 'Avalon, sans-serif',
  };

  const focusHandler  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#EB5939';
    e.target.style.boxShadow   = isMasked ? 'none' : '3px 3px 0px #EB5939';
  };
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = isMasked ? 'rgba(255,253,248,0.5)' : '#0A0A0A';
    e.target.style.boxShadow   = 'none';
  };

  return (
    <div id="contact" className="w-full px-6 md:px-16 py-24 md:py-32">
      {/* Label */}
      <p className={`${accentColor} text-xs uppercase tracking-[0.4em] avalon-bold mb-6`} style={textStyle}>
        Get In Touch
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left */}
        <div>
          {/* Heading — same DOM in both variants */}
          <h2
            ref={isMasked ? undefined : headingRef}
            className={`text-5xl md:text-6xl lg:text-7xl avalon-bold leading-[0.95] tracking-tight mb-8 ${textColor}`}
            data-mask-expand="420"
          >
            {HEADING_WORDS.map((word, wi) => (
              <React.Fragment key={wi}>
                <AnimatedWord
                  delay={wi * 100}
                  inView={headingInView}
                  animate={!isMasked}
                  finalColor={isMasked ? '#FFFDF8' : '#0A0A0A'}
                >
                  {word}
                </AnimatedWord>
                {wi < HEADING_WORDS.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </h2>

          <p className={`${textColor} opacity-70 avalon text-lg leading-relaxed mb-12`} style={textStyle}>
            Have a project in mind? Drop us a line and we&apos;ll get back to you within 24 hours.
          </p>

          <div className="space-y-5">
            <a href={`mailto:${company.contact.email}`} className={`flex items-center gap-3 group ${textColor}`} style={textStyle}>
              <span className="text-xs avalon-bold uppercase tracking-widest opacity-50">Email</span>
              <span className="avalon-bold text-lg group-hover:text-tertiary transition-colors duration-200">{company.contact.email}</span>
            </a>
            <a href={`tel:${company.contact.phone}`} className={`flex items-center gap-3 group ${textColor}`} style={textStyle}>
              <span className="text-xs avalon-bold uppercase tracking-widest opacity-50">Phone</span>
              <span className="avalon-bold text-lg group-hover:text-tertiary transition-colors duration-200">{company.contact.phone}</span>
            </a>
            <div className={`flex items-center gap-3 ${textColor}`} style={textStyle}>
              <span className="text-xs avalon-bold uppercase tracking-widest opacity-50">Base</span>
              <span className="avalon-bold text-lg">{company.contact.address}</span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-3 mt-10 flex-wrap">
            {Object.entries(company.contact.social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`neo-tag capitalize ${textColor} hover:bg-tertiary hover:text-background transition-colors duration-200`}
                style={{ border: isMasked ? '2px solid rgba(255,253,248,0.5)' : '2px solid #0A0A0A', ...textStyle }}
              >
                {platform}
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <div
          className="p-8"
          style={{
            border: '3px solid',
            borderColor: isMasked ? 'rgba(255,253,248,0.4)' : '#0A0A0A',
            boxShadow: isMasked ? 'none' : '8px 8px 0px #0A0A0A',
          }}
        >
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className={`text-2xl avalon-bold ${textColor} mb-3`} style={textStyle}>Message sent!</h3>
              <p className={`${textColor} opacity-70 avalon`} style={textStyle}>We&apos;ll be in touch within 24 hours.</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className={`block text-xs avalon-bold uppercase tracking-widest ${textColor} opacity-60 mb-2`} style={textStyle}>Name</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={`block text-xs avalon-bold uppercase tracking-widest ${textColor} opacity-60 mb-2`} style={textStyle}>Email</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                  placeholder="hello@yourcompany.com"
                />
              </div>
              <div>
                <label className={`block text-xs avalon-bold uppercase tracking-widest ${textColor} opacity-60 mb-2`} style={textStyle}>Service</label>
                <select
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={focusHandler} onBlur={blurHandler}
                >
                  <option value="" style={{ background: '#FFFDF8', color: '#0A0A0A' }}>Select a service…</option>
                  <option value="ai-dev"     style={{ background: '#FFFDF8', color: '#0A0A0A' }}>Custom AI Development</option>
                  <option value="automation" style={{ background: '#FFFDF8', color: '#0A0A0A' }}>AI Automation</option>
                  <option value="mvp"        style={{ background: '#FFFDF8', color: '#0A0A0A' }}>AI Powered MVP</option>
                  <option value="strategy"   style={{ background: '#FFFDF8', color: '#0A0A0A' }}>AI Strategy & Consultation</option>
                  <option value="genai"      style={{ background: '#FFFDF8', color: '#0A0A0A' }}>Generative AI Solutions</option>
                  <option value="data"       style={{ background: '#FFFDF8', color: '#0A0A0A' }}>AI Driven Data Insights</option>
                  <option value="brand"      style={{ background: '#FFFDF8', color: '#0A0A0A' }}>Brand Design</option>
                  <option value="web"        style={{ background: '#FFFDF8', color: '#0A0A0A' }}>Website Development</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs avalon-bold uppercase tracking-widest ${textColor} opacity-60 mb-2`} style={textStyle}>Message</label>
                <textarea
                  rows={4} required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={inputStyle} onFocus={focusHandler} onBlur={blurHandler}
                  placeholder="Tell us about your project…"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 neo-btn-primary avalon-bold uppercase tracking-wider text-sm"
                style={{
                  border: isMasked ? '3px solid #FFFDF8' : '3px solid #0A0A0A',
                  boxShadow: isMasked ? '4px 4px 0 #FFFDF8' : '4px 4px 0 #0A0A0A',
                  background: '#EB5939',
                  color: '#fff',
                }}
              >
                Send Message →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
