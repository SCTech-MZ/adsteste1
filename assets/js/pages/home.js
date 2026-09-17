/**
 * SmartTools Hub - homepage behaviour.
 * Fills the featured tools, category grid and recently added sections from the
 * shared registry so the homepage never drifts out of sync with the directory.
 */

import { basePath, $ } from '../utils.js';
import { featuredTools, recentTools, countByCategory } from '../data/tools.js';
import { renderToolCards, renderCategoryCards } from '../components/tool-card.js';

function boot() {
  const base = basePath();

  renderToolCards($('#featured-tools'), featuredTools(5), { base, headingLevel: 3 });
  renderToolCards($('#recent-tools'), recentTools(4), { base, headingLevel: 3 });
  renderCategoryCards($('#categories-grid'), countByCategory, base);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
