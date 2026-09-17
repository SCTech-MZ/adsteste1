/**
 * SmartTools Hub - SVG icon set.
 * All icons are stroke based, inherit `currentColor` and are decorative by
 * default. No external icon library or font is loaded.
 */

const PATHS = {
  logo:
    '<path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z"/><path d="m9.5 12 1.8 1.8 3.4-3.6"/>',

  texto:
    '<path d="M4 7V5h16v2"/><path d="M9 19h6"/><path d="M12 5v14"/>',
  calculadora:
    '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7.5h8"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M8 16h.01"/><path d="M12 16h.01"/><path d="M16 16h.01"/>',
  conversor:
    '<path d="M7 4v13"/><path d="M3.5 13.5 7 17l3.5-3.5"/><path d="M17 20V7"/><path d="M13.5 10.5 17 7l3.5 3.5"/>',
  codigo:
    '<path d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"/><path d="m13.5 9-3 6"/>',
  produtividade:
    '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  praticas:
    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',

  calendario:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 14h2"/><path d="M14 14h2"/><path d="M8 17.5h2"/>',
  relogio:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  percentagem:
    '<path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
  maiusculas:
    '<path d="m3 19 4.5-12L12 19"/><path d="M4.7 15h5.6"/><path d="M20 19v-5.5a2.75 2.75 0 0 0-5.5 0V19"/><path d="M20 16.5h-3.2"/>',
  seguranca:
    '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>',
  imagem:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m4 17 4.4-4.4a2 2 0 0 1 2.8 0L15.6 17"/><path d="m14 15.4 1.6-1.6a2 2 0 0 1 2.8 0L21 16.4"/>',
  cor:
    '<path d="M12 3s6 6.1 6 10.1A6 6 0 0 1 6 13.1C6 9.1 12 3 12 3Z"/>',
  financas:
    '<path d="M3 10 12 4l9 6"/><path d="M5 10v9"/><path d="M9.5 10v9"/><path d="M14.5 10v9"/><path d="M19 10v9"/><path d="M3 21h18"/>',
  saude:
    '<path d="M12 20.5 4.6 13a4.8 4.8 0 0 1 6.8-6.8l.6.6.6-.6A4.8 4.8 0 0 1 19.4 13Z"/>',
  hash:
    '<path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3.5 8 20.5"/><path d="M16 3.5l-2 17"/>',
  documento:
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>',
  mundo:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  qrcode:
    '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3.5"/><path d="M20 14v3"/><path d="M14 20h3"/><path d="M20 20h.01"/>',

  procurar:
    '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  lupa:
    '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  sol:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v1.8"/><path d="M12 19.7v1.8"/><path d="M4.2 4.2l1.3 1.3"/><path d="M18.5 18.5l1.3 1.3"/><path d="M2.5 12h1.8"/><path d="M19.7 12h1.8"/><path d="M4.2 19.8l1.3-1.3"/><path d="M18.5 5.5l1.3-1.3"/>',
  lua:
    '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/>',
  copiar:
    '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  limpar:
    '<path d="M3 6h18"/><path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6"/><path d="M6 6v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  reiniciar:
    '<path d="M20 11a8 8 0 1 0-2.4 5.7"/><path d="M20 4.5V11h-6.5"/>',
  trocar:
    '<path d="M7 4v13"/><path d="M3.5 13.5 7 17l3.5-3.5"/><path d="M17 20V7"/><path d="M13.5 10.5 17 7l3.5 3.5"/>',
  verificar:
    '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>',
  erro:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.3h.01"/>',
  aviso:
    '<path d="M10.3 3.9 2.4 17.4A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 16.5h.01"/>',
  info:
    '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.8h.01"/>',
  seta:
    '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  setaCima:
    '<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>',
  raio:
    '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  escudo:
    '<path d="M12 3 5 6v6c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  dispositivo:
    '<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18.5h2"/>',
  globo:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z"/>',
  gratuito:
    '<circle cx="12" cy="12" r="9"/><path d="M15.2 9.2a3.4 3.4 0 0 0-3.2-1.7c-1.6 0-3.1.9-3.1 2.3 0 3 6.3 1.6 6.3 4.6 0 1.4-1.5 2.3-3.2 2.3a3.4 3.4 0 0 1-3.2-1.7"/><path d="M12 6.2v11.6"/>',
  acima:
    '<path d="M12 20V6"/><path d="m6 12 6-6 6 6"/>',
  abaixo:
    '<path d="M12 4v14"/><path d="m6 12 6 6 6-6"/>',
  menu:
    '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
  email:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 7.2 5.4a2 2 0 0 0 2.6 0L20.5 7"/>',
  utilizador:
    '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  ideia:
    '<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6v.5h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z"/>',
  impressora:
    '<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  tabela:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M9 10v10"/><path d="M15 10v10"/>',
  ficheiro:
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>',
  ligacao:
    '<path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1"/><path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"/>',
  caixa:
    '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5"/><path d="M12 12v9"/>',
};

/**
 * Return a full inline SVG element as a string.
 * @param {string} name Icon key.
 * @param {string} [className] Extra CSS classes.
 * @param {object} [attrs] Extra attributes (e.g. { width: 20 }).
 * @returns {string} SVG markup.
 */
export function icon(name, className = 'icon', attrs = {}) {
  const body = PATHS[name] || PATHS.info;
  const extra = Object.entries(attrs)
    .map(([key, value]) => `${key}="${String(value)}"`)
    .join(' ');
  return (
    `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ` +
    `aria-hidden="true" focusable="false"${extra ? ' ' + extra : ''}>${body}</svg>`
  );
}

export const ICON_NAMES = Object.keys(PATHS);

export default icon;
