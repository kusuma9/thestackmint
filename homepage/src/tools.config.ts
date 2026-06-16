export type ToolCategory =
  | 'Security & Auth'
  | 'DevOps & SaaS'
  | 'Products';

export type ToolSection = 'homelab' | 'saas' | 'ai-agents';

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  brandColor?: string; // 6-digit hex, no #
  category: ToolCategory;
  section: ToolSection;
  tags: string[];
  adminOnly?: boolean;
}

export const CATEGORIES: ToolCategory[] = [
  'Security & Auth',
  'DevOps & SaaS',
  'Products',
];

export const HOMELAB_CATEGORIES: ToolCategory[] = [
  'Security & Auth',
  'DevOps & SaaS',
];

export const tools: Tool[] = [
  // --- Security & Auth ---
  {
    id: 'authelia',
    name: 'Authelia',
    description: 'Single sign-on portal and 2FA for all services',
    url: 'https://auth.mystackmint.com',
    icon: '/icons/authelia.svg',
    brandColor: '4F46E5',
    category: 'Security & Auth',
    section: 'homelab',
    tags: ['sso', 'auth', '2fa', 'totp', 'security'],
  },

  // --- DevOps & SaaS ---
  {
    id: 'adminer',
    name: 'Adminer',
    description: 'Web-based database admin — PostgreSQL and MariaDB',
    url: 'https://db.mystackmint.com',
    icon: '/icons/adminer.svg',
    brandColor: 'E05D18',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['database', 'postgres', 'sql', 'admin', 'devops'],
    adminOnly: true,
  },
  {
    id: 'portainer',
    name: 'Portainer',
    description: 'Visual Docker management — containers, volumes, logs',
    url: 'https://portainer.mystackmint.com',
    icon: '/icons/portainer.svg',
    brandColor: '13BEF9',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['docker', 'containers', 'management', 'devops'],
    adminOnly: true,
  },
  {
    id: 'coolify-hetzner',
    name: 'Coolify (Hetzner)',
    description: 'Deploy and manage all Hetzner VPS services — Docker, domains, and SSL',
    url: 'https://coolhetz.mystackmint.com',
    icon: '/icons/coolify.svg',
    brandColor: '8C52FF',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['coolify', 'deploy', 'docker', 'devops', 'hetzner'],
    adminOnly: true,
  },
  {
    id: 'coolify-contabo',
    name: 'Coolify (Contabo)',
    description: 'Deploy and manage all Contabo VPS services — Docker, domains, and SSL',
    url: 'https://coolcontb.mystackmint.com',
    icon: '/icons/coolify.svg',
    brandColor: '8C52FF',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['coolify', 'deploy', 'docker', 'devops', 'contabo'],
    adminOnly: true,
  },

  {
    id: 'beszel',
    name: 'Beszel',
    description: 'Server monitoring — CPU, RAM, disk and Docker stats with alerts',
    url: 'https://monitor.mystackmint.com',
    icon: '/icons/beszel.svg',
    brandColor: '22C55E',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['monitoring', 'metrics', 'disk', 'alerts', 'devops'],
    adminOnly: true,
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma',
    description: 'Uptime monitoring — alerts when any app stops responding',
    url: 'https://uptime.mystackmint.com',
    icon: '/icons/uptime-kuma.svg',
    brandColor: '5CDD8B',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['uptime', 'monitoring', 'alerts', 'status', 'devops'],
    adminOnly: true,
  },

  // --- Media ---
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Media server — stream movies, series, music, and more',
    url: 'https://jellyfin.mystackmint.com',
    icon: '/icons/jellyfin.svg',
    brandColor: '00A4DC',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['media', 'streaming', 'movies', 'music', 'series'],
  },
  {
    id: 'navidrome',
    name: 'Navidrome',
    description: 'Music streaming server — stream your personal music library',
    url: 'https://music.mystackmint.com',
    icon: '/icons/navidrome.svg',
    brandColor: '0084ff',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['music', 'streaming', 'audio', 'media'],
  },
  {
    id: 'immich',
    name: 'Immich',
    description: 'Photo and video backup — self-hosted Google Photos alternative',
    url: 'https://photos.mystackmint.com',
    icon: '/icons/immich.svg',
    brandColor: 'FA2921',
    category: 'DevOps & SaaS',
    section: 'homelab',
    tags: ['photos', 'videos', 'backup', 'media', 'gallery'],
  },

  // --- SaaS Products (own apps) ---
  {
    id: 'codefinderhub',
    name: 'India Pincode & IFSC Finder',
    description: 'Look up Indian postal pincodes and bank IFSC codes instantly',
    url: 'https://codefinderhub.com/',
    icon: '/icons/codefinderhub.svg',
    brandColor: 'F59E0B',
    category: 'Products',
    section: 'saas',
    tags: ['pincode', 'ifsc', 'india', 'banking', 'postal', 'lookup'],
  },

];
