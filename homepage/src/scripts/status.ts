// Polls Uptime Kuma status page API every 60s and updates status dots
// Uptime Kuma API: GET /api/status-page/heartbeat/<slug>
// Returns: { heartbeatList: { [monitorId]: HeartBeat[] }, uptimeList: { ... } }

const POLL_INTERVAL_MS = 60_000;
const STATUS_API_URL = '/api/status'; // proxied by Nginx to avoid CORS

type HeartBeat = { status: 0 | 1 | 2 | 3; time: string; msg?: string };

// Map Uptime Kuma monitor name → tool id (add your monitor names here)
const MONITOR_MAP: Record<string, string> = {
  authelia: 'authelia',
  portainer: 'portainer',
  adminer: 'adminer',
};

type StatusLevel = 'up' | 'degraded' | 'down' | 'unknown';

function heartbeatToStatus(beats: HeartBeat[] | undefined): StatusLevel {
  if (!beats || beats.length === 0) return 'unknown';
  const latest = beats[beats.length - 1];
  if (latest.status === 1) return 'up';
  if (latest.status === 2) return 'degraded';
  if (latest.status === 0) return 'down';
  return 'unknown';
}

function applyStatus(toolId: string, status: StatusLevel) {
  const dots = document.querySelectorAll<HTMLElement>(`.status-dot[data-tool-id="${toolId}"]`);
  const classMap: Record<StatusLevel, string> = {
    up: 'bg-emerald-400',
    degraded: 'bg-amber-400',
    down: 'bg-rose-500',
    unknown: 'bg-muted/30',
  };
  const titleMap: Record<StatusLevel, string> = {
    up: 'Online',
    degraded: 'Degraded',
    down: 'Offline',
    unknown: 'Status unknown',
  };

  dots.forEach((dot) => {
    dot.className = dot.className.replace(
      /bg-(?:emerald|amber|rose|muted)[^\s]*/g, ''
    ).trim();
    dot.classList.add('w-2.5', 'h-2.5', 'rounded-full', 'status-dot', classMap[status]);
    dot.title = titleMap[status];
  });
}

async function fetchStatus() {
  try {
    const res = await fetch(`${STATUS_API_URL}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json() as {
      heartbeatList?: Record<string, HeartBeat[]>;
    };

    if (!data.heartbeatList) return;

    for (const [monitorName, beats] of Object.entries(data.heartbeatList)) {
      const toolId = MONITOR_MAP[monitorName.toLowerCase()];
      if (toolId) {
        applyStatus(toolId, heartbeatToStatus(beats));
      }
    }
  } catch {
    // Silent fail — status dots stay neutral
  }
}

export function setupStatus() {
  // Don't poll if no Uptime Kuma API configured
  const statusMeta = document.querySelector<HTMLMetaElement>('meta[name="uptime-kuma-url"]');
  if (!statusMeta?.content) return;

  fetchStatus();
  setInterval(fetchStatus, POLL_INTERVAL_MS);
}
