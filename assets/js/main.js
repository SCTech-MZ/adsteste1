/**
 * SmartTools Hub - application shell.
 * Handles the theme switch, the responsive navigation, small UI helpers and
 * the optional integrations (analytics / AdSense) that stay disabled until a
 * real identifier is configured by the site owner.
 */

import { $, $$, copyText, toast, urlFor } from './utils.js';

/* -------------------------------------------------------------------------
 * Configuration
 * Fill these values to activate the optional integrations. They are empty on
 * purpose: the site works perfectly without them and no third-party request
 * is made while they stay empty.
 * ---------------------------------------------------------------------- */
export const SITE_CONFIG = {
  googleAnalyticsId: '',
  adsenseClientId: '',
};

/* ------------------------------- Theme ---------------------------------- */
const THEME_KEY = 'sth-theme';

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage may be unavailable in private mode */
  }
  $$('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    const label =
      theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
  });
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1020' : '#ffffff');
}

function initTheme() {
  const stored = (() => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  })();
  if (!stored) {
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
  applyTheme(currentTheme());

  $$('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (event) => {
    let hasStored = true;
    try {
      hasStored = Boolean(localStorage.getItem(THEME_KEY));
    } catch {
      hasStored = false;
    }
    if (!hasStored) applyTheme(event.matches ? 'dark' : 'light');
  });
}

/* --------------------------- Mobile navigation -------------------------- */
function initNavigation() {
  const toggle = $('[data-menu-toggle]');
  const nav = $('#menu-principal');
  if (!toggle || !nav) return;

  const overlay = $('.nav-overlay');
  const close = () => {
    nav.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu de navegação');
    document.body.style.removeProperty('overflow');
  };
  const open = () => {
    nav.classList.add('is-open');
    overlay?.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu de navegação');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') close();
    else open();
  });

  overlay?.addEventListener('click', close);

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close();
      toggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 860) close();
  });
}

/* ----------------------- Copy buttons + year + ads --------------------- */
function initCopyButtons() {
  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('[data-copy-target]');
    if (!trigger) return;
    event.preventDefault();
    const target = document.getElementById(trigger.dataset.copyTarget);
    if (!target) return;
    const value = 'value' in target ? target.value : target.textContent;
    if (!value || !value.trim()) {
      toast('Nada para copiar.', 'warning');
      return;
    }
    const ok = await copyText(value);
    toast(ok ? trigger.dataset.copyMessage || 'Copiado para a área de transferência.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
  });
}

function initYear() {
  $$('[data-current-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function initExternalLinks() {
  $$('a[href^="http"]').forEach((link) => {
    const isExternal = !link.href.startsWith(window.location.origin);
    if (isExternal && !link.hasAttribute('data-no-external')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

/* --------------------- Optional integrations (opt-in) ------------------- */
function initAnalytics() {
  const id = SITE_CONFIG.googleAnalyticsId;
  if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(tag);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
}

function initAds() {
  const client = SITE_CONFIG.adsenseClientId;
  const slots = $$('.ad-slot[data-ad-slot]');
  if (slots.length === 0) return;
  if (!client || !/^ca-pub-\d+$/.test(client)) {
    /* Keeps the reserved containers visible as placeholders only. */
    return;
  }
  const loader = document.createElement('script');
  loader.async = true;
  loader.crossOrigin = 'anonymous';
  loader.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.appendChild(loader);

  slots.forEach((slot) => {
    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'block';
    ad.dataset.adClient = client;
    ad.dataset.adSlot = slot.dataset.adSlot;
    ad.dataset.adFormat = slot.dataset.adFormat || 'auto';
    ad.dataset.fullWidthResponsive = 'true';
    slot.textContent = '';
    slot.appendChild(ad);
    slot.dataset.adFilled = 'true';
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
}

/* ------------------------------ Bootstrap ------------------------------- */
function boot() {
  document.documentElement.classList.remove('no-js');
  initTheme();
  initNavigation();
  initCopyButtons();
  initYear();
  initExternalLinks();
  initAnalytics();
  initAds();
}

/* Public, tiny API available to inline snippets and tools. */
window.STH = Object.assign(window.STH || {}, {
  copyText,
  toast,
  SITE_CONFIG,
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

export { urlFor };
