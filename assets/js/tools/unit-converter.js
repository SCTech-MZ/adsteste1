/**
 * Tool: Conversor de Unidades.
 * Data driven conversion for length, mass, temperature, time and volume.
 * Linear categories use a conversion factor against a base unit; temperature
 * uses explicit formulas. No network access, no rounding surprises.
 */

import { $, $$, LOCALE, copyText, parseDecimal, setFieldError, toast } from '../utils.js';

const CATEGORIES = {
  comprimento: {
    label: 'Comprimento',
    base: 'metro',
    description: 'Distâncias e medidas lineares, do milímetro à milha náutica.',
    units: {
      milimetro: { name: 'Milímetro', symbol: 'mm', factor: 0.001 },
      centimetro: { name: 'Centímetro', symbol: 'cm', factor: 0.01 },
      metro: { name: 'Metro', symbol: 'm', factor: 1 },
      quilometro: { name: 'Quilómetro', symbol: 'km', factor: 1000 },
      polegada: { name: 'Polegada', symbol: 'in', factor: 0.0254 },
      pe: { name: 'Pé', symbol: 'ft', factor: 0.3048 },
      jarda: { name: 'Jarda', symbol: 'yd', factor: 0.9144 },
      milha: { name: 'Milha', symbol: 'mi', factor: 1609.344 },
      milhaNautica: { name: 'Milha náutica', symbol: 'nmi', factor: 1852 },
    },
  },
  peso: {
    label: 'Massa e peso',
    base: 'quilograma',
    description: 'Medidas de massa, incluindo as unidades anglo-saxónicas mais comuns.',
    units: {
      miligrama: { name: 'Miligrama', symbol: 'mg', factor: 0.000001 },
      grama: { name: 'Grama', symbol: 'g', factor: 0.001 },
      quilograma: { name: 'Quilograma', symbol: 'kg', factor: 1 },
      tonelada: { name: 'Tonelada', symbol: 't', factor: 1000 },
      onca: { name: 'Onça', symbol: 'oz', factor: 0.028349523125 },
      libra: { name: 'Libra', symbol: 'lb', factor: 0.45359237 },
      stone: { name: 'Stone', symbol: 'st', factor: 6.35029318 },
    },
  },
  temperatura: {
    label: 'Temperatura',
    description: 'Conversão exata entre Celsius, Fahrenheit e Kelvin.',
    units: {
      celsius: { name: 'Grau Celsius', symbol: '°C' },
      fahrenheit: { name: 'Grau Fahrenheit', symbol: '°F' },
      kelvin: { name: 'Kelvin', symbol: 'K' },
    },
  },
  tempo: {
    label: 'Tempo',
    base: 'segundo',
    description: 'Intervalos de tempo do milissegundo ao ano.',
    units: {
      milissegundo: { name: 'Milissegundo', symbol: 'ms', factor: 0.001 },
      segundo: { name: 'Segundo', symbol: 's', factor: 1 },
      minuto: { name: 'Minuto', symbol: 'min', factor: 60 },
      hora: { name: 'Hora', symbol: 'h', factor: 3600 },
      dia: { name: 'Dia', symbol: 'd', factor: 86400 },
      semana: { name: 'Semana', symbol: 'sem', factor: 604800 },
      mes: { name: 'Mês (30 dias)', symbol: 'mês', factor: 2592000 },
      ano: { name: 'Ano (365 dias)', symbol: 'ano', factor: 31536000 },
    },
  },
  volume: {
    label: 'Volume',
    base: 'litro',
    description: 'Capacidade e volume para cozinha, laboratório e combustíveis.',
    units: {
      mililitro: { name: 'Mililitro', symbol: 'ml', factor: 0.001 },
      litro: { name: 'Litro', symbol: 'L', factor: 1 },
      metroCubico: { name: 'Metro cúbico', symbol: 'm³', factor: 1000 },
      galaoUS: { name: 'Galão (EUA)', symbol: 'gal', factor: 3.785411784 },
      galaoUK: { name: 'Galão (RU)', symbol: 'gal UK', factor: 4.54609 },
      oncaLiquidaUS: { name: 'Onça líquida (EUA)', symbol: 'fl oz', factor: 0.0295735295625 },
      chavena: { name: 'Chávena (240 ml)', symbol: 'cháv', factor: 0.24 },
    },
  },
};

const DEFAULTS = {
  comprimento: ['metro', 'pe'],
  peso: ['quilograma', 'libra'],
  temperatura: ['celsius', 'fahrenheit'],
  tempo: ['hora', 'minuto'],
  volume: ['litro', 'galaoUS'],
};

const TABLE_VALUES = [0, 1, 5, 10, 25, 100];

function toCelsius(unit, value) {
  if (unit === 'fahrenheit') return ((value - 32) * 5) / 9;
  if (unit === 'kelvin') return value - 273.15;
  return value;
}

function fromCelsius(unit, value) {
  if (unit === 'fahrenheit') return (value * 9) / 5 + 32;
  if (unit === 'kelvin') return value + 273.15;
  return value;
}

function convert(categoryId, value, fromUnit, toUnit) {
  const category = CATEGORIES[categoryId];
  if (categoryId === 'temperatura') {
    return fromCelsius(toUnit, toCelsius(fromUnit, value));
  }
  const from = category.units[fromUnit];
  const to = category.units[toUnit];
  return (value * from.factor) / to.factor;
}

/** Human friendly number formatting, switching to scientific when useful. */
function formatResult(value) {
  if (!Number.isFinite(value)) return '—';
  const absolute = Math.abs(value);
  if (absolute !== 0 && (absolute < 1e-6 || absolute >= 1e15)) {
    return value.toExponential(6).replace('e', ' × 10^');
  }
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 6 }).format(value);
}

function boot() {
  const root = $('#conversor-unidades');
  if (!root) return;

  const input = $('#valor-origem');
  const fromSelect = $('#unidade-origem');
  const toSelect = $('#unidade-destino');
  const resultValue = $('#conversor-resultado');
  const resultUnit = $('#conversor-resultado-unidade');
  const rate = $('#conversor-taxa');
  const formula = $('#conversor-formula');
  const tableBody = $('#conversor-tabela-corpo');
  const tableHead = $$('#conversor-tabela thead th');
  const alertBox = $('#conversor-alerta');
  const description = $('#conversor-descricao');
  const tabs = $$('.tab', root);

  let categoryId = 'comprimento';

  function fillSelects() {
    const { units } = CATEGORIES[categoryId];
    const options = Object.entries(units)
      .map(([id, unit]) => `<option value="${id}">${unit.name} (${unit.symbol})</option>`)
      .join('');
    const [defaultFrom, defaultTo] = DEFAULTS[categoryId] || Object.keys(units).slice(0, 2);
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
    fromSelect.value = defaultFrom;
    toSelect.value = defaultTo;
  }

  function renderTable() {
    if (!tableBody) return;
    const { units } = CATEGORIES[categoryId];
    const from = fromSelect.value;
    const to = toSelect.value;
    if (tableHead.length >= 2) {
      tableHead[1].textContent = `${units[from].name} → ${units[to].name}`;
    }
    tableBody.innerHTML = TABLE_VALUES.map((value) => {
      const converted = convert(categoryId, value, from, to);
      return `<tr><td>${formatResult(value)} ${units[from].symbol}</td><td>${formatResult(converted)} ${units[to].symbol}</td></tr>`;
    }).join('');
  }

  function render() {
    const { units } = CATEGORIES[categoryId];
    const from = fromSelect.value;
    const to = toSelect.value;
    const raw = input.value.trim();

    if (alertBox) alertBox.hidden = true;

    if (raw === '') {
      setFieldError(input, '');
      resultValue.textContent = '—';
      resultUnit.textContent = units[to].symbol;
      rate.textContent = `1 ${units[from].symbol} = ${formatResult(convert(categoryId, 1, from, to))} ${units[to].symbol}`;
      formula.textContent = 'Introduza um valor para converter.';
      renderTable();
      return;
    }

    const value = parseDecimal(raw);
    if (value === null) {
      setFieldError(input, 'Introduza um número válido (pode usar vírgula ou ponto decimal).');
      resultValue.textContent = '—';
      resultUnit.textContent = units[to].symbol;
      if (alertBox) {
        alertBox.className = 'alert alert--error';
        alertBox.textContent = 'O valor introduzido não é um número válido.';
        alertBox.hidden = false;
      }
      renderTable();
      return;
    }

    setFieldError(input, '');
    const converted = convert(categoryId, value, from, to);
    resultValue.textContent = formatResult(converted);
    resultUnit.textContent = units[to].symbol;
    rate.textContent = `1 ${units[from].symbol} = ${formatResult(convert(categoryId, 1, from, to))} ${units[to].symbol}`;

    if (categoryId === 'temperatura') {
      formula.textContent = `Fórmula: ${units[from].symbol} → ${units[to].symbol} (conversão em duas etapas, com base em graus Celsius).`;
    } else {
      const factor = units[from].factor / units[to].factor;
      formula.textContent = `Fórmula: valor × (${formatResult(units[from].factor)} ÷ ${formatResult(units[to].factor)}) = valor × ${formatResult(factor)}`;
    }

    renderTable();
  }

  function selectCategory(next) {
    categoryId = next;
    tabs.forEach((tab) => {
      const active = tab.dataset.category === next;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (description) description.textContent = CATEGORIES[next].description;
    fillSelects();
    render();
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectCategory(tab.dataset.category));
    tab.addEventListener('keydown', (event) => {
      const index = tabs.indexOf(tab);
      let target = null;
      if (event.key === 'ArrowRight') target = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (target) {
        event.preventDefault();
        target.focus();
        selectCategory(target.dataset.category);
      }
    });
  });

  input?.addEventListener('input', render);
  fromSelect?.addEventListener('change', render);
  toSelect?.addEventListener('change', render);

  $('#btn-trocar')?.addEventListener('click', () => {
    const previousFrom = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = previousFrom;
    render();
  });

  $('#btn-reset')?.addEventListener('click', () => {
    input.value = '';
    setFieldError(input, '');
    fillSelects();
    render();
    input?.focus();
    toast('Conversor reiniciado.', 'info');
  });

  $('#btn-copiar-resultado')?.addEventListener('click', async () => {
    const value = resultValue?.textContent?.trim();
    if (!value || value === '—') {
      toast('Ainda não há resultado para copiar.', 'warning');
      return;
    }
    const text = `${value} ${resultUnit?.textContent || ''}`.trim();
    const ok = await copyText(text);
    toast(ok ? 'Resultado copiado.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
  });

  selectCategory('comprimento');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
