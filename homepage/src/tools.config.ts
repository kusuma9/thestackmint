export type ToolCategory =
  | 'Files & Storage'
  | 'Photos & Media'
  | 'Security & Auth'
  | 'Productivity'
  | 'Finance & Home'
  | 'DevOps & SaaS'
  | 'AI Agents'
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
  'Files & Storage',
  'Photos & Media',
  'Security & Auth',
  'Productivity',
  'Finance & Home',
  'DevOps & SaaS',
  'AI Agents',
  'Products',
];

export const HOMELAB_CATEGORIES: ToolCategory[] = [
  'Files & Storage',
  'Photos & Media',
  'Security & Auth',
  'Productivity',
  'Finance & Home',
  'DevOps & SaaS',
];

export const AI_AGENT_CATEGORIES: ToolCategory[] = [
  'AI Agents',
];

export const tools: Tool[] = [
  // --- Files & Storage ---
  {
    id: 'nextcloud',
    name: 'Nextcloud',
    description: 'Files, contacts, calendar, and team collaboration',
    url: 'https://cloud.mystackmint.com',
    icon: '/icons/nextcloud.svg',
    brandColor: '0082C9',
    category: 'Files & Storage',
    section: 'homelab',
    tags: ['files', 'calendar', 'contacts', 'sync', 'cloud'],
  },
  {
    id: 'filebrowser',
    name: 'Filebrowser',
    description: 'Lightweight web file manager for quick access',
    url: 'https://files.mystackmint.com',
    icon: '/icons/filebrowser.svg',
    brandColor: '4285F4',
    category: 'Files & Storage',
    section: 'homelab',
    tags: ['files', 'storage', 'browser'],
  },
  {
    id: 'paperless',
    name: 'Paperless-NGX',
    description: 'Scan, OCR, and organise family documents digitally',
    url: 'https://docs.mystackmint.com',
    icon: '/icons/paperless.svg',
    brandColor: '00BCD4',
    category: 'Files & Storage',
    section: 'homelab',
    tags: ['documents', 'ocr', 'scan', 'receipts', 'paperless'],
  },

  // --- Photos & Media ---
  {
    id: 'immich',
    name: 'Immich',
    description: 'Self-hosted photo & video backup for the whole family',
    url: 'https://photos.mystackmint.com',
    icon: '/icons/immich.svg',
    brandColor: '4250AF',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['photos', 'backup', 'mobile', 'gallery', 'ai'],
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Stream your movies, TV shows, and live TV',
    url: 'https://media.mystackmint.com',
    icon: '/icons/jellyfin.svg',
    brandColor: '00A4DC',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['media', 'movies', 'tv', 'streaming'],
  },
  {
    id: 'navidrome',
    name: 'Navidrome',
    description: 'Stream your personal music library anywhere',
    url: 'https://music.mystackmint.com',
    icon: '/icons/navidrome.svg',
    brandColor: '2C4C7C',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['music', 'audio', 'streaming', 'subsonic'],
  },
  {
    id: 'kavita',
    name: 'Kavita',
    description: 'Read manga, comics, and ebooks in the browser',
    url: 'https://books.mystackmint.com',
    icon: '/icons/kavita.png',
    brandColor: '7C3AED',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['books', 'ebooks', 'manga', 'comics', 'reading'],
  },

  // --- Security & Auth ---
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    description: 'Bitwarden-compatible password manager for the family',
    url: 'https://vault.mystackmint.com',
    icon: '/icons/vaultwarden.svg',
    brandColor: '175DDC',
    category: 'Security & Auth',
    section: 'homelab',
    tags: ['passwords', 'vault', 'bitwarden', '2fa', 'security'],
  },
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

  // --- Productivity ---
  {
    id: 'vikunja',
    name: 'Vikunja',
    description: 'Task management and to-do lists for the family',
    url: 'https://tasks.mystackmint.com',
    icon: '/icons/vikunja.svg',
    brandColor: '47B983',
    category: 'Productivity',
    section: 'homelab',
    tags: ['tasks', 'todos', 'projects', 'kanban'],
  },
  {
    id: 'stirling-pdf',
    name: 'Stirling PDF',
    description: 'All-in-one PDF editor, merger, and converter',
    url: 'https://pdf.mystackmint.com',
    icon: '/icons/stirling-pdf.svg',
    brandColor: 'E53E3E',
    category: 'Productivity',
    section: 'homelab',
    tags: ['pdf', 'documents', 'convert', 'merge', 'tools'],
  },
  {
    id: 'linkwarden',
    name: 'Linkwarden',
    description: 'Bookmark manager with auto-archiving and tagging',
    url: 'https://links.mystackmint.com',
    icon: '/icons/linkwarden.svg',
    brandColor: '6366F1',
    category: 'Productivity',
    section: 'homelab',
    tags: ['bookmarks', 'links', 'archive', 'reading'],
  },

  // --- Finance & Home ---
  {
    id: 'actual-budget',
    name: 'Actual Budget',
    description: 'Privacy-first family budget and finance tracker',
    url: 'https://budget.mystackmint.com',
    icon: '/icons/actual-budget.svg',
    brandColor: '4A9B56',
    category: 'Finance & Home',
    section: 'homelab',
    tags: ['budget', 'finance', 'money', 'tracking'],
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
