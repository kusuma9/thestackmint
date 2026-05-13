import Fuse from 'fuse.js';
import type { Tool } from '../tools.config';

let fuse: Fuse<Tool> | null = null;
let allTools: Tool[] = [];
let selectedIndex = -1;

function initSearch() {
  const dataEl = document.getElementById('tools-data');
  if (!dataEl) return;

  allTools = JSON.parse(dataEl.textContent ?? '[]') as Tool[];

  fuse = new Fuse(allTools, {
    keys: [
      { name: 'name', weight: 3 },
      { name: 'description', weight: 2 },
      { name: 'tags', weight: 1 },
      { name: 'category', weight: 0.5 },
    ],
    threshold: 0.35,
    includeScore: true,
    minMatchCharLength: 1,
  });
}

function renderResults(results: Tool[]) {
  const list = document.getElementById('search-results')!;
  const empty = document.getElementById('search-empty')!;

  list.innerHTML = '';
  selectedIndex = -1;

  if (results.length === 0) {
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  results.forEach((tool, i) => {
    const li = document.createElement('li');
    li.role = 'option';
    li.setAttribute('aria-selected', 'false');
    li.className =
      'search-result flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-100 hover:bg-surface2';
    li.dataset.index = String(i);
    li.dataset.url = tool.url;

    const isPath = tool.icon.startsWith('/') || tool.icon.startsWith('http');

    const iconHtml = isPath
      ? `<div class="flex-shrink-0 w-9 h-9 rounded-xl bg-surface2 border border-border
                     flex items-center justify-center">
           <img src="${tool.icon}" alt="" width="24" height="24"
                style="width:24px;height:24px;object-fit:contain;"
                loading="eager"
                onerror="this.style.display='none';" />
         </div>`
      : `<span class="text-2xl w-9 text-center flex-shrink-0" aria-hidden="true">${tool.icon}</span>`;

    li.innerHTML = `
      ${iconHtml}
      <div class="flex flex-col min-w-0">
        <span class="text-sm font-semibold text-white truncate">${tool.name}</span>
        <span class="text-xs text-muted truncate">${tool.description}</span>
      </div>
      <span class="ml-auto text-[10px] font-mono text-muted/50 flex-shrink-0 hidden sm:block">${tool.category}</span>
    `;

    li.addEventListener('click', () => {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
      closeSearch();
    });

    list.appendChild(li);
  });
}

function setSelected(index: number) {
  const items = document.querySelectorAll<HTMLElement>('.search-result');
  items.forEach((el, i) => {
    const active = i === index;
    el.classList.toggle('bg-surface2', active);
    el.setAttribute('aria-selected', String(active));
    if (active) el.scrollIntoView({ block: 'nearest' });
  });
  selectedIndex = index;
}

function openSearch() {
  const modal = document.getElementById('search-modal')!;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const input = document.getElementById('search-input') as HTMLInputElement;
  input.value = '';
  renderResults(allTools.slice(0, 8));
  setTimeout(() => input.focus(), 50);
}

function closeSearch() {
  document.getElementById('search-modal')!.classList.add('hidden');
  document.body.style.overflow = '';
}

function handleKey(e: KeyboardEvent) {
  const items = document.querySelectorAll<HTMLElement>('.search-result');
  const count = items.length;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    setSelected(Math.min(selectedIndex + 1, count - 1));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setSelected(Math.max(selectedIndex - 1, 0));
  } else if (e.key === 'Enter' && selectedIndex >= 0) {
    const url = items[selectedIndex]?.dataset.url;
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      closeSearch();
    }
  } else if (e.key === 'Escape') {
    closeSearch();
  }
}

export function setupSearch() {
  initSearch();

  const input = document.getElementById('search-input') as HTMLInputElement;
  const backdrop = document.getElementById('search-backdrop')!;
  const overlay = document.getElementById('sidebar-overlay');

  input?.addEventListener('input', () => {
    const q = input.value.trim();
    if (!fuse) return;
    const results = q ? fuse.search(q).map((r) => r.item) : allTools.slice(0, 8);
    renderResults(results);
  });

  input?.addEventListener('keydown', handleKey);
  backdrop?.addEventListener('click', closeSearch);
  overlay?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  });

  // CMD+K / Ctrl+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const modal = document.getElementById('search-modal')!;
      modal.classList.contains('hidden') ? openSearch() : closeSearch();
    }
  });

  // Search button if present
  document.getElementById('search-btn')?.addEventListener('click', openSearch);
}
