/**
 * SmartTools Hub - tools directory.
 * Real time search + category filtering entirely in the browser. The state is
 * mirrored in the URL (?q=&categoria=) so results can be shared or bookmarked.
 */

import { $, $$, basePath, debounce, plural } from '../utils.js';
import { CATEGORIES, TOOLS, countByCategory } from '../data/tools.js';
import { renderToolCards } from '../components/tool-card.js';

const state = { query: '', category: 'all' };

/** Normalise a string for accent and case insensitive matching. */
function normalise(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matches(tool, query) {
  if (!query) return true;
  const haystack = normalise(
    [tool.name, tool.shortName, tool.description, ...(tool.keywords || [])].join(' '),
  );
  return query
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(normalise(term)));
}

function filtered() {
  return TOOLS.filter(
    (tool) =>
      (state.category === 'all' || tool.category === state.category) &&
      matches(tool, state.query),
  );
}

function renderChips() {
  const container = $('#category-filters');
  if (!container) return;

  const chips = [
    { id: 'all', name: 'Todas', count: TOOLS.length },
    ...CATEGORIES.map((category) => ({
      id: category.id,
      name: category.short,
      count: countByCategory(category.id),
    })),
  ];

  container.innerHTML = chips
    .map(
      (chip) => `
      <button type="button" class="chip" role="tab"
        data-category="${chip.id}"
        aria-selected="${chip.id === state.category}"
        aria-pressed="${chip.id === state.category}">
        ${chip.name}<span class="count">${chip.count}</span>
      </button>`,
    )
    .join('');
}

function updateUrl() {
  if (!window.history?.replaceState) return;
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.category !== 'all') params.set('categoria', state.category);
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
  window.history.replaceState(null, '', url);
}

function render() {
  const base = basePath();
  const grid = $('#tools-grid');
  const counter = $('#results-count');
  const list = filtered();

  renderToolCards(grid, list, {
    base,
    headingLevel: 3,
    emptyMessage:
      'Não encontrámos ferramentas com esses critérios. Tente remover filtros ou pesquisar por outro termo.',
  });

  $$('#category-filters .chip').forEach((chip) => {
    const active = chip.dataset.category === state.category;
    chip.setAttribute('aria-selected', String(active));
    chip.setAttribute('aria-pressed', String(active));
  });

  if (counter) {
    const noun = plural(list.length, 'ferramenta encontrada', 'ferramentas encontradas');
    counter.textContent = `${list.length} ${noun}`;
  }

  const clear = $('#clear-filters');
  if (clear) clear.hidden = !state.query && state.category === 'all';

  updateUrl();
}

function readUrl() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('categoria');
  if (category && CATEGORIES.some((item) => item.id === category)) {
    state.category = category;
  }
  const query = params.get('q');
  if (query) {
    state.query = query;
    const input = $('#tool-search');
    if (input) input.value = query;
  }
}

function boot() {
  const input = $('#tool-search');
  const chips = $('#category-filters');
  if (!input && !chips) return;

  readUrl();
  renderChips();
  render();

  input?.addEventListener(
    'input',
    debounce((event) => {
      state.query = event.target.value.trim();
      render();
    }, 120),
  );

  input?.addEventListener('search', (event) => {
    state.query = event.target.value.trim();
    render();
  });

  chips?.addEventListener('click', (event) => {
    const chip = event.target.closest('.chip');
    if (!chip) return;
    state.category = chip.dataset.category;
    render();
  });

  $('#clear-filters')?.addEventListener('click', () => {
    state.query = '';
    state.category = 'all';
    if (input) input.value = '';
    render();
    input?.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== input && input) {
      event.preventDefault();
      input.focus();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
