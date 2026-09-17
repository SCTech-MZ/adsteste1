/**
 * SmartTools Hub - presentational components shared by the pages.
 * Rendered from the registry in `data/tools.js`, so a tool only needs to be
 * declared once to appear in the directory, the homepage and related blocks.
 */

import { icon } from '../icons.js';
import { CATEGORIES, getCategory } from '../data/tools.js';
import { escapeHtml } from '../utils.js';

/**
 * Markup for a single tool card.
 * @param {object} tool Registry entry.
 * @param {{base?: string, headingLevel?: number}} [options]
 */
export function toolCardHTML(tool, options = {}) {
  const { base = '', headingLevel = 3 } = options;
  const category = getCategory(tool.category);
  const isLive = tool.status === 'live';
  const href = base + tool.url;
  const tag = `h${Math.min(Math.max(headingLevel, 2), 4)}`;
  const categoryLabel = category ? category.name : 'Ferramenta';

  const badge = isLive
    ? '<span class="badge badge--live">Disponível</span>'
    : '<span class="badge badge--soon">Em breve</span>';

  const foot = isLive
    ? `<a class="card-link" href="${href}">Usar ferramenta ${icon('seta', 'icon')}</a>`
    : '<span class="badge badge--soon">Em breve</span>';

  return `
    <article class="card card--tool${isLive ? '' : ' card--soon'}" data-tool-card data-tool-id="${escapeHtml(tool.id)}">
      <div class="card-top">
        <span class="card-icon" aria-hidden="true">${icon(tool.icon, 'icon')}</span>
        ${badge}
      </div>
      <div class="card-body">
        <${tag} class="mb-0">
          ${isLive ? `<a href="${href}">${escapeHtml(tool.name)}</a>` : escapeHtml(tool.name)}
        </${tag}>
        <p>${escapeHtml(tool.description)}</p>
      </div>
      <div class="card-foot">
        <span class="badge badge--neutral">${escapeHtml(categoryLabel)}</span>
        ${foot}
      </div>
    </article>`;
}

/** Render the cards of `tools` inside `container`. */
export function renderToolCards(container, tools, options = {}) {
  if (!container) return;
  if (!tools.length) {
    renderEmptyState(container, options.emptyMessage);
    return;
  }
  container.innerHTML = tools.map((tool) => toolCardHTML(tool, options)).join('');
}

/** Accessible empty state for search/filter results. */
export function renderEmptyState(container, message) {
  if (!container) return;
  container.innerHTML = `
    <div class="empty-state" role="status">
      ${icon('procurar', 'icon')}
      <h3>Nenhuma ferramenta encontrada</h3>
      <p>${escapeHtml(message || 'Tente outro termo de pesquisa ou selecione uma categoria diferente.')}</p>
    </div>`;
}

/** Markup for a category card (homepage and directory). */
export function categoryCardHTML(category, options = {}) {
  const { base = '', count = 0 } = options;
  return `
    <a class="category-card" href="${base}tools.html?categoria=${encodeURIComponent(category.id)}">
      <span class="card-icon" aria-hidden="true">${icon(category.icon, 'icon')}</span>
      <span>
        <h3>${escapeHtml(category.name)}</h3>
        <p>${escapeHtml(category.description)}</p>
        <span class="count">${count} ${count === 1 ? 'ferramenta' : 'ferramentas'}</span>
      </span>
    </a>`;
}

/** Render every category card. */
export function renderCategoryCards(container, countFn, base = '') {
  if (!container) return;
  container.innerHTML = CATEGORIES.map((category) =>
    categoryCardHTML(category, { base, count: countFn(category.id) }),
  ).join('');
}

/** Compact card used for blog previews (homepage and blog index). */
export function articleCardHTML(article, options = {}) {
  const { base = '', headingLevel = 3 } = options;
  const tag = `h${Math.min(Math.max(headingLevel, 2), 4)}`;
  return `
    <article class="card article-card">
      <div class="article-thumb" aria-hidden="true">${icon(article.icon || 'documento', 'icon')}</div>
      <div class="article-body">
        <div class="article-meta">
          <span class="badge badge--neutral">${escapeHtml(article.category)}</span>
          <span>${escapeHtml(article.readingTime || '5 min de leitura')}</span>
        </div>
        <${tag} class="mb-0"><a href="${base}${article.url}">${escapeHtml(article.title)}</a></${tag}>
        <p>${escapeHtml(article.excerpt)}</p>
        <div class="card-foot">
          <a class="card-link" href="${base}${article.url}">Ler artigo ${icon('seta', 'icon')}</a>
        </div>
      </div>
    </article>`;
}
