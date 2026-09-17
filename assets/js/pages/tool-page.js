/**
 * SmartTools Hub - shared behaviour for every individual tool page.
 * Reads the current tool from the `data-current-tool` attribute and renders
 * the "related tools" block, keeping every tool page consistent.
 */

import { $, basePath } from '../utils.js';
import { relatedTools } from '../data/tools.js';
import { renderToolCards } from '../components/tool-card.js';

function boot() {
  const container = $('#related-tools');
  if (!container) return;
  const id = container.dataset.currentTool;
  if (!id) return;
  renderToolCards(container, relatedTools(id, 3), { base: basePath(), headingLevel: 3 });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
