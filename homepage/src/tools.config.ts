export type ToolCategory =
  | 'Files & Storage'
  | 'Photos & Media'
  | 'Security & Auth'
  | 'Productivity'
  | 'Utilities'
  | 'DevOps & SaaS';

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: ToolCategory;
  tags: string[];
  adminOnly?: boolean;
}

export const CATEGORIES: ToolCategory[] = [
  'Files & Storage',
  'Photos & Media',
  'Security & Auth',
  'Productivity',
  'Utilities',
  'DevOps & SaaS',
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
    tags: ['files', 'calendar', 'contacts', 'sync', 'cloud'],
  },
  {
    id: 'filebrowser',
    name: 'Filebrowser',
    description: 'Lightweight web file manager for quick access',
    url: 'https://files.mystackmint.com',
    icon: '📂',
    category: 'Files & Storage',
    tags: ['files', 'storage', 'browser'],
  },
  {
    id: 'paperless',
    name: 'Paperless-NGX',
    description: 'Scan, OCR, and organise family documents digitally',
    url: 'https://docs.mystackmint.com',
    icon: '🗂️',
    category: 'Files & Storage',
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
    tags: ['photos', 'backup', 'mobile', 'gallery', 'ai'],
  },
  {
    id: 'jellyfin',
    name: 'Jellyfin',
    description: 'Stream your movies, TV shows, and live TV',
    url: 'https://media.mystackmint.com',
    icon: '🎬',
    category: 'Photos & Media',
    tags: ['media', 'movies', 'tv', 'streaming'],
  },
  {
    id: 'navidrome',
    name: 'Navidrome',
    description: 'Stream your personal music library anywhere',
    url: 'https://music.mystackmint.com',
    icon: '🎵',
    category: 'Photos & Media',
    tags: ['music', 'audio', 'streaming', 'subsonic'],
  },

  // --- Security & Auth ---
  {
    id: 'vaultwarden',
    name: 'Vaultwarden',
    description: 'Bitwarden-compatible password manager for the family',
    url: 'https://vault.mystackmint.com',
    icon: '🔑',
    category: 'Security & Auth',
    tags: ['passwords', 'vault', 'bitwarden', '2fa', 'security'],
  },
  {
    id: 'authelia',
    name: 'Authelia',
    description: 'Single sign-on portal and 2FA for all services',
    url: 'https://auth.mystackmint.com',
    icon: '🛡️',
    category: 'Security & Auth',
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
    tags: ['tasks', 'todos', 'projects', 'kanban'],
  },
  {
    id: 'actual-budget',
    name: 'Actual Budget',
    description: 'Privacy-first family budget and finance tracker',
    url: 'https://budget.mystackmint.com',
    icon: '💰',
    category: 'Productivity',
    tags: ['budget', 'finance', 'money', 'tracking'],
  },
  {
    id: 'mealie',
    name: 'Mealie',
    description: 'Recipe manager and meal planner for the household',
    url: 'https://recipes.mystackmint.com',
    icon: '🍳',
    category: 'Productivity',
    tags: ['recipes', 'cooking', 'meal-planning', 'food'],
  },
  {
    id: 'grocy',
    name: 'Grocy',
    description: 'Household management — groceries, chores, inventory',
    url: 'https://home.mystackmint.com',
    icon: '🏠',
    category: 'Productivity',
    tags: ['groceries', 'household', 'inventory', 'chores'],
  },

  // --- Utilities ---
  {
    id: 'kavita',
    name: 'Kavita',
    description: 'Read manga, comics, and ebooks in the browser',
    url: 'https://books.mystackmint.com',
    icon: '📖',
    category: 'Utilities',
    tags: ['books', 'ebooks', 'manga', 'comics', 'reading'],
  },
  {
    id: 'stirling-pdf',
    name: 'Stirling PDF',
    description: 'All-in-one PDF editor, merger, and converter',
    url: 'https://pdf.mystackmint.com',
    icon: '📄',
    category: 'Utilities',
    tags: ['pdf', 'documents', 'convert', 'merge', 'tools'],
  },
  {
    id: 'linkwarden',
    name: 'Linkwarden',
    description: 'Bookmark manager with auto-archiving and tagging',
    url: 'https://links.mystackmint.com',
    icon: '🔖',
    category: 'Utilities',
    tags: ['bookmarks', 'links', 'archive', 'reading'],
  },
  {
    id: 'uptime-kuma',
    name: 'Uptime Kuma',
    description: 'Service monitoring dashboard and public status page',
    url: 'https://status.mystackmint.com',
    icon: '📈',
    category: 'Utilities',
    tags: ['monitoring', 'status', 'uptime', 'alerts'],
  },
  {
    id: 'ntfy',
    name: 'Ntfy',
    description: 'Self-hosted push notifications — backups, alerts, deploys',
    url: 'https://ntfy.mystackmint.com',
    icon: '🔔',
    category: 'Utilities',
    tags: ['notifications', 'push', 'alerts', 'mobile'],
  },
  {
    id: 'glances',
    name: 'Glances',
    description: 'Real-time server resource monitor — CPU, RAM, disk, network',
    url: 'https://glances.mystackmint.com',
    icon: '📊',
    category: 'Utilities',
    tags: ['monitoring', 'resources', 'cpu', 'ram', 'server'],
    adminOnly: true,
  },

  // --- DevOps & SaaS ---
  {
    id: 'umami',
    name: 'Umami',
    description: 'Privacy-first web analytics for SaaS apps — no cookies',
    url: 'https://analytics.mystackmint.com',
    icon: '📉',
    category: 'DevOps & SaaS',
    tags: ['analytics', 'stats', 'traffic', 'saas', 'privacy'],
    adminOnly: true,
  },
  {
    id: 'gitea',
    name: 'Gitea',
    description: 'Self-hosted Git for infrastructure and SaaS source code',
    url: 'https://git.mystackmint.com',
    icon: '🐙',
    category: 'DevOps & SaaS',
    tags: ['git', 'code', 'repositories', 'ci', 'devops'],
    adminOnly: true,
  },
  {
    id: 'woodpecker',
    name: 'Woodpecker CI',
    description: 'Continuous integration and automated deployments',
    url: 'https://ci.mystackmint.com',
    icon: '⚙️',
    category: 'DevOps & SaaS',
    tags: ['ci', 'cd', 'pipelines', 'deploy', 'devops'],
    adminOnly: true,
  },
  {
    id: 'adminer',
    name: 'Adminer',
    description: 'Web-based database admin — connect to any PostgreSQL or MariaDB instance',
    url: 'https://db.mystackmint.com',
    icon: '🗄️',
    category: 'DevOps & SaaS',
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
    tags: ['docker', 'containers', 'management', 'devops'],
    adminOnly: true,
  },
];
