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
    id: 'familyhealth',
    name: 'Family Healthcare',
    tagline: "One private app for your whole family's health.",
    description:
      'Track medications, appointments, vitals, and health records for parents, children, and grandparents — together, in one secure place.',
    emoji: '🌿',
    iconBg: '#e3efe7',
    badge: 'Health · Family',
    pageUrl: '/familyhealth',
    platform: 'android',
    status: 'live',
    primaryCta: 'Explore app →',
    secondaryCta: 'Download for Android',
  },
  {
    id: 'safeheir',
    name: 'SafeHeir',
    tagline: 'Secure Family Legacy Vault — tell your family where everything is.',
    description:
      'Record where your documents, assets, bank accounts, and insurance policies are kept — so your family is never lost when you are gone.',
    emoji: '⚜',
    iconBg: '#1A1A2E',
    badge: 'Legacy · Estate Planning',
    pageUrl: '/safeheir',
    platform: 'android',
    status: 'coming-soon',
    primaryCta: 'Get Notified →',
  },
  {
    id: 'codefinderhub',
    name: 'CodeFinderHub',
    tagline: "India's Pincode & IFSC lookup, made simple.",
    description:
      'Search any Indian Pincode, IFSC code, or bank branch instantly — free web tool, no sign-up needed. All of India covered.',
    emoji: '📮',
    iconBg: '#fdf0e3',
    badge: 'Pincode · IFSC · Free',
    pageUrl: '/codefinderhub',
    externalUrl: 'https://codefinderhub.com',
    platform: 'web',
    status: 'live',
    primaryCta: 'Check it now →',
  },
];
