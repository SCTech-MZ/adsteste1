/**
 * SmartTools Hub - shared helpers.
 * Small, dependency free utilities reused by the shell and by every tool.
 * Everything runs in the browser; no data is ever sent to a server.
 */

export const LOCALE = 'pt-PT';

/** querySelector shortcut. */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/** querySelectorAll shortcut returning a real array. */
export const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

/** The base path prefix of the current page, from <body data-base>. */
export function basePath() {
  return document.body?.dataset.base || '';
}

/** Resolve a root-relative project path for the current page depth. */
export function urlFor(path) {
  return basePath() + path;
}

/** Wait `ms` after the last call before running `fn`. */
export function debounce(fn, ms = 150) {
  let timer;
  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/** Keep a number inside a range. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Format a number for the Portuguese interface. */
export function formatNumber(value, options = {}) {
  if (!Number.isFinite(value)) return '-';
  return new Intl.NumberFormat(LOCALE, {
    maximumFractionDigits: 6,
    ...options,
  }).format(value);
}

/**
 * Read a decimal number from user input, accepting both the comma and the
 * dot as decimal separators and ignoring spaces used as thousand separators.
 * @returns {number|null} null when the value is not a valid number.
 */
export function parseDecimal(raw) {
  if (raw === null || raw === undefined) return null;
  const cleaned = String(raw)
    .trim()
    .replace(/\s|\u00a0/g, '')
    .replace(/\.(?=\d{3}\b)/g, '')
    .replace(',', '.');
  if (cleaned === '' || !/^-?\d*\.?\d+(e-?\d+)?$/i.test(cleaned)) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/**
 * Parse a date from an <input type="date"> value (YYYY-MM-DD) as a local
 * date at midnight, avoiding the UTC shift of `new Date('YYYY-MM-DD')`.
 * @returns {Date|null}
 */
export function parseLocalDate(value) {
  if (!value || typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Today at local midnight. */
export function today() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

/** Number of days in a given month (1-12). */
export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/** Format a Date as D de mês de YYYY. */
export function formatLongDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Plural aware label helper: plural(1, 'dia', 'dias'). */
export function plural(count, singular, pluralForm) {
  return count === 1 ? singular : pluralForm;
}

/**
 * Copy text to the clipboard.
 * Uses the async Clipboard API with a `textarea` fallback for older browsers
 * and for pages served over plain HTTP.
 * @returns {Promise<boolean>}
 */
export async function copyText(text) {
  const value = String(text ?? '');
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '-1000px';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, value.length);
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

const TOAST_ICONS = {
  success: 'verificar',
  error: 'erro',
  info: 'info',
  warning: 'aviso',
};

/**
 * Show a short, accessible status message at the bottom of the screen.
 * Falls back to an inline alert region when the region is missing.
 */
export function toast(message, type = 'info') {
  let region = document.getElementById('sth-toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'sth-toast-region';
    region.className = 'toast-region';
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }
  const item = document.createElement('div');
  item.className = `toast toast--${type}`;
  item.textContent = message;
  region.appendChild(item);
  window.setTimeout(() => item.classList.add('is-leaving'), 2600);
  window.setTimeout(() => item.remove(), 3200);
}

/** Toggle a field error message and the invalid state of an input. */
export function setFieldError(input, message) {
  if (!input) return;
  const holder =
    input.closest('.field')?.querySelector('.field-error') ||
    document.getElementById(`${input.id}-error`);
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    if (holder) {
      holder.textContent = message;
      holder.classList.add('is-visible');
    }
  } else {
    input.removeAttribute('aria-invalid');
    if (holder) {
      holder.textContent = '';
      holder.classList.remove('is-visible');
    }
  }
}

/** Clear every validation error inside a container. */
export function clearErrors(scope = document) {
  $$('[aria-invalid="true"]', scope).forEach((input) => setFieldError(input, ''));
}

/** Show/hide an alert element with a message. */
export function showAlert(element, message, type = 'info') {
  if (!element) return;
  element.className = `alert alert--${type}`;
  element.textContent = message;
  element.hidden = false;
}

export function hideAlert(element) {
  if (element) element.hidden = true;
}

/** Escape a string for safe insertion into HTML. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Keyboard helper: run `fn` when Enter (and optionally Escape) is pressed. */
export function onKey(element, key, fn) {
  element?.addEventListener('keydown', (event) => {
    if (event.key === key) {
      if (key !== 'Escape') event.preventDefault();
      fn(event);
    }
  });
}
