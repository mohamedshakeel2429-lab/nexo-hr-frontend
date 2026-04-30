import React, { createContext, useContext, useEffect, useState } from 'react';
import { contentService, type HeroContent, type GlobalContent, type AboutContent } from '../services/content.service';

// Seed defaults — used as fallback when API is unreachable
const DEFAULT_HERO: HeroContent = {
  heading: 'Where People &',
  gradientText: 'Workplaces Meet',
  subtitle: 'End-to-end HR solutions that help SMEs recruit smarter, comply confidently, and grow sustainably.',
  cta: { primary: 'Book Free Consultation', secondary: 'Explore Services' },
};

const DEFAULT_GLOBAL: GlobalContent = {
  companyName: 'NEXO HR Solutions',
  tagline: 'Where People & Workplaces Meet',
  phone: '7200721109',
  email: 'nexo.hrsolutions@gmail.com',
  address: 'Chennai, Tamil Nadu, India',
  officeHours: 'Mon – Fri · 9 AM – 6 PM',
  experience: '10+ Years',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  facebook: 'https://facebook.com',
};

const DEFAULT_ABOUT: AboutContent = {
  heading: 'Pioneering Human Capital Excellence',
  story: 'Founded over a decade ago in Chennai, NEXO HR Solutions was built with one clear purpose: to be the HR backbone that growing businesses never had access to.',
  mission: 'To empower SMEs with enterprise-grade HR practices — making compliance seamless, hiring precise, and workplaces thriving.',
  vision: 'A future where every business, regardless of size, has access to world-class human capital management.',
};

interface SiteContentState {
  hero: HeroContent;
  global: GlobalContent;
  about: AboutContent;
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentState>({
  hero: DEFAULT_HERO,
  global: DEFAULT_GLOBAL,
  about: DEFAULT_ABOUT,
  loading: true,
});

export const useSiteContent = () => useContext(SiteContentContext);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SiteContentState>({
    hero: DEFAULT_HERO,
    global: DEFAULT_GLOBAL,
    about: DEFAULT_ABOUT,
    loading: true,
  });

  useEffect(() => {
    contentService
      .getAll()
      .then((blocks) => {
        const find = (key: string) => blocks.find((b) => b.key === key)?.data;
        setState({
          hero: (find('hero') as HeroContent) ?? DEFAULT_HERO,
          global: (find('global') as GlobalContent) ?? DEFAULT_GLOBAL,
          about: (find('about') as AboutContent) ?? DEFAULT_ABOUT,
          loading: false,
        });
      })
      .catch(() => {
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return <SiteContentContext.Provider value={state}>{children}</SiteContentContext.Provider>;
}
