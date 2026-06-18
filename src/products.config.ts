export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  iconBg: string;
  badge: string;
  pageUrl: string;
  externalUrl?: string;
  platform: 'android' | 'web' | 'api';
  status: 'live' | 'coming-soon';
  primaryCta: string;
  secondaryCta?: string;
}

export const products: Product[] = [
  {
    id: 'vitafamily',
    name: 'VitaFamily Health',
    tagline: "One private app for your whole family's health.",
    description:
      'Track medications, appointments, vitals, and health records for parents, children, and grandparents — together, in one secure place.',
    emoji: '🌿',
    iconBg: '#e3efe7',
    badge: 'Health · Family',
    pageUrl: '/vitafamily',
    platform: 'android',
    status: 'live',
    primaryCta: 'Explore app →',
    secondaryCta: 'Download for Android',
  },
  {
    id: 'codefinderhub',
    name: 'CodeFinderHub',
    tagline: "India's fastest Pincode & IFSC lookup.",
    description:
      'Instant Indian postal and banking code lookups for developers, fintechs, and e-commerce businesses. Clean web UI, REST API, and batch processing.',
    emoji: '📮',
    iconBg: '#fdf0e3',
    badge: 'Developer · Fintech',
    pageUrl: '/codefinderhub',
    externalUrl: 'https://codefinderhub.com',
    platform: 'web',
    status: 'live',
    primaryCta: 'Try it free →',
    secondaryCta: 'View API docs',
  },
];
