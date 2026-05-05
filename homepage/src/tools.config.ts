export type ToolCategory =
  | 'Files & Storage'
  | 'Photos & Media'
  | 'Security & Auth'
  | 'Productivity'
  | 'Finance & Home'
  | 'DevOps & SaaS';

export type ToolSection = 'homelab' | 'saas';

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
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
];

export const HOMELAB_CATEGORIES: ToolCategory[] = [
  'Files & Storage',
  'Photos & Media',
  'Security & Auth',
  'Productivity',
  'Finance & Home',
];

export const tools: Tool[] = [
  // --- Files & Storage ---
  {
    id: 'nextcloud',
    name: 'Nextcloud',
    description: 'Files, contacts, calendar, and team collaboration',
    url: 'https://cloud.mystackmint.com',
    icon: '☁️',
    category: 'Files & Storage',
    section: 'homelab',
    tags: ['files', 'calendar', 'contacts', 'sync', 'cloud'],
  },
  {
    id: 'filebrowser',
    name: 'Filebrowser',
    description: 'Lightweight web file manager for quick access',
    url: 'https://files.mystackmint.com',
    icon: '📂',
    category: 'Files & Storage',
    section: 'homelab',
    tags: ['files', 'storage', 'browser'],
  },
  {
    id: 'paperless',
    name: 'Paperless-NGX',
    description: 'Scan, OCR, and organise family documents digitally',
    url: 'https://docs.mystackmint.com',
    icon: '🗂️',
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
    icon: '🖼️',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['photos', 'backup', 'mobile', 'gallery', 'ai'],
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Stream your movies, TV shows, and live TV',
    url: 'https://media.mystackmint.com',
    icon: '🎬',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['media', 'movies', 'tv', 'streaming'],
  },
  {
    id: 'navidrome',
    name: 'Navidrome',
    description: 'Stream your personal music library anywhere',
    url: 'https://music.mystackmint.com',
    icon: '🎵',
    category: 'Photos & Media',
    section: 'homelab',
    tags: ['music', 'audio', 'streaming', 'subsonic'],
  },
  {
    id: 'kavita',
    name: 'Kavita',
    description: 'Read manga, comics, and ebooks in the browser',
    url: 'https://books.mystackmint.com',
    icon: '📖',
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
    icon: '🔑',
    category: 'Security & Auth',
    section: 'homelab',
    tags: ['passwords', 'vault', 'bitwarden', '2fa', 'security'],
  },
  {
    id: 'authelia',
    name: 'Authelia',
    description: 'Single sign-on portal and 2FA for all services',
    url: 'https://auth.mystackmint.com',
    icon: '🛡️',
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
    icon: '✅',
    category: 'Productivity',
    section: 'homelab',
    tags: ['tasks', 'todos', 'projects', 'kanban'],
  },
  {
    id: 'stirling-pdf',
    name: 'Stirling PDF',
    description: 'All-in-one PDF editor, merger, and converter',
    url: 'https://pdf.mystackmint.com',
    icon: '📄',
    category: 'Productivity',
    section: 'homelab',
    tags: ['pdf', 'documents', 'convert', 'merge', 'tools'],
  },
  {
    id: 'linkwarden',
    name: 'Linkwarden',
    description: 'Bookmark manager with auto-archiving and tagging',
    url: 'https://links.mystackmint.com',
    icon: '🔖',
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
    icon: '💰',
    category: 'Finance & Home',
    section: 'homelab',
    tags: ['budget', 'finance', 'money', 'tracking'],
  },
  {
    id: 'mealie',
    name: 'Mealie',
    description: 'Recipe manager and meal planner for the whole family',
    url: 'https://recipes.mystackmint.com',
    icon: '🍽️',
    category: 'Finance & Home',
    section: 'homelab',
    tags: ['recipes', 'food', 'meal', 'planning'],
  },
  {
    id: 'grocy',
    name: 'Grocy',
    description: 'Grocery management and household chores tracker',
    url: 'https://home.mystackmint.com',
    icon: '🛒',
    category: 'Finance & Home',
    section: 'homelab',
    tags: ['grocery', 'shopping', 'household', 'chores'],
  },

  // --- DevOps & SaaS ---
  {
    id: 'umami',
    name: 'Umami',
    description: 'Privacy-first web analytics for SaaS apps — no cookies',
    url: 'https://analytics.mystackmint.com',
    icon: '📉',
    category: 'DevOps & SaaS',
    section: 'saas',
    tags: ['analytics', 'stats', 'traffic', 'saas', 'privacy'],
    adminOnly: true,
  },
  {
    id: 'adminer',
    name: 'Adminer',
    description: 'Web-based database admin — PostgreSQL and MariaDB',
    url: 'https://db.mystackmint.com',
    icon: '🗄️',
    category: 'DevOps & SaaS',
    section: 'saas',
    tags: ['database', 'postgres', 'sql', 'admin', 'devops'],
    adminOnly: true,
  },
  {
    id: 'portainer',
    name: 'Portainer',
    description: 'Visual Docker management — containers, volumes, logs',
    url: 'https://portainer.mystackmint.com',
    icon: '🐳',
    category: 'DevOps & SaaS',
    section: 'saas',
    tags: ['docker', 'containers', 'management', 'devops'],
    adminOnly: true,
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma',
    description: 'Service monitoring dashboard and public status page',
    url: 'https://status.mystackmint.com',
    icon: '📈',
    category: 'DevOps & SaaS',
    section: 'saas',
    tags: ['monitoring', 'status', 'uptime', 'alerts'],
  },
  {
    id: 'ntfy',
    name: 'Ntfy',
    description: 'Self-hosted push notifications — backups, alerts, deploys',
    url: 'https://ntfy.mystackmint.com',
    icon: '🔔',
    category: 'DevOps & SaaS',
    section: 'saas',
    tags: ['notifications', 'push', 'alerts', 'mobile'],
  },
  {
    id: 'glances',
    name: 'Glances',
    description: 'Real-time server resource monitor — CPU, RAM, disk, network',
    url: 'https://glances.mystackmint.com',
    icon: '📊',
    category: 'DevOps & SaaS',
    section: 'saas',
    tags: ['monitoring', 'resources', 'cpu', 'ram', 'server'],
    adminOnly: true,
  },
];
