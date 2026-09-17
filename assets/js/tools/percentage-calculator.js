/**
 * Tool: Calculadora de Porcentagem.
 * Five calculation modes with live results, input validation and a
 * step-by-step explanation of the formula used.
 */

import { $, $$, copyText, formatNumber, parseDecimal, setFieldError, toast } from '../utils.js';

/** Format a number for display without trailing zeros. */
function fmt(value) {
  return formatNumber(value, { maximumFractionDigits: 4 });
}

/** Read a numeric input and report a validation error when needed. */
function readField(id, label) {
  const input = document.getElementById(id);
  if (!input) return { value: null, empty: true, error: null };
  const raw = input.value.trim();
  if (raw === '') {
    setFieldError(input, '');
    return { value: null, empty: true, error: null };
  }
  const value = parseDecimal(raw);
  if (value === null) {
    const error = `Introduza um número válido em “${label}”.`;
    setFieldError(input, error);
    return { value: null, empty: false, error };
  }
  setFieldError(input, '');
  return { value, empty: false, error: null };
}

const MODES = {
  'x-de-y': {
    fields: [
      ['p1-percent', 'Percentagem (%)'],
      ['p1-value', 'Valor base'],
    ],
    compute({ p1Percent, p1Value }) {
      const result = (p1Value * p1Percent) / 100;
      return {
        label: `${fmt(p1Percent)}% de ${fmt(p1Value)}`,
        value: fmt(result),
        detail: `São ${fmt(result)} de um total de ${fmt(p1Value)}.`,
        steps: [
          'Fórmula: resultado = valor × percentagem ÷ 100',
          `resultado = ${fmt(p1Value)} × ${fmt(p1Percent)} ÷ 100`,
          `resultado = ${fmt(result)}`,
        ],
      };
    },
  },

  'quanto-porcento': {
    fields: [
      ['p2-part', 'Parte'],
      ['p2-whole', 'Total'],
    ],
    compute({ p2Part, p2Whole }) {
      if (p2Whole === 0) {
        return { error: 'O total não pode ser zero: a divisão por zero não tem resultado definido.' };
      }
      const result = (p2Part / p2Whole) * 100;
      return {
        label: `${fmt(p2Part)} em relação a ${fmt(p2Whole)}`,
        value: `${fmt(result)}%`,
        detail: `${fmt(p2Part)} representa ${fmt(result)}% de ${fmt(p2Whole)}.`,
        steps: [
          'Fórmula: percentagem = (parte ÷ total) × 100',
          `percentagem = (${fmt(p2Part)} ÷ ${fmt(p2Whole)}) × 100`,
          `percentagem = ${fmt(p2Part / p2Whole)} × 100 = ${fmt(result)}%`,
        ],
      };
    },
  },

  variacao: {
    fields: [
      ['p3-from', 'Valor inicial'],
      ['p3-to', 'Valor final'],
    ],
    compute({ p3From, p3To }) {
      if (p3From === 0) {
        return {
          error:
            'O valor inicial não pode ser zero, porque a variação percentual é calculada em relação a ele.',
        };
      }
      const difference = p3To - p3From;
      const rate = (difference / Math.abs(p3From)) * 100;
      const increased = difference >= 0;
      return {
        label: increased ? 'Aumento percentual' : 'Diminuição percentual',
        value: `${increased ? '+' : '-'}${fmt(Math.abs(rate))}%`,
        detail: `${increased ? 'Aumentou' : 'Diminuiu'} ${fmt(Math.abs(difference))} unidades, de ${fmt(p3From)} para ${fmt(p3To)}.`,
        steps: [
          'Fórmula: variação = ((valor final − valor inicial) ÷ |valor inicial|) × 100',
          `diferença = ${fmt(p3To)} − ${fmt(p3From)} = ${fmt(difference)}`,
          `variação = (${fmt(difference)} ÷ ${fmt(Math.abs(p3From))}) × 100 = ${fmt(rate)}%`,
        ],
      };
    },
  },

  desconto: {
    fields: [
      ['p4-price', 'Preço original'],
      ['p4-discount', 'Desconto (%)'],
    ],
    compute({ p4Price, p4Discount }) {
      if (p4Discount < 0) {
        return { error: 'O desconto não pode ser negativo.' };
      }
      if (p4Discount > 100) {
        return { error: 'Um desconto acima de 100% tornaria o preço final negativo.' };
      }
      const saving = (p4Price * p4Discount) / 100;
      const final = p4Price - saving;
      return {
        label: 'Preço com desconto',
        value: fmt(final),
        detail: `Poupa ${fmt(saving)} num total de ${fmt(p4Price)} (desconto de ${fmt(p4Discount)}%).`,
        steps: [
          'Fórmula: valor poupado = preço × desconto ÷ 100',
          `valor poupado = ${fmt(p4Price)} × ${fmt(p4Discount)} ÷ 100 = ${fmt(saving)}`,
          `preço final = ${fmt(p4Price)} − ${fmt(saving)} = ${fmt(final)}`,
        ],
      };
    },
  },

  'valor-original': {
    fields: [
      ['p5-final', 'Valor final'],
      ['p5-rate', 'Variação aplicada (%)'],
    ],
    compute({ p5Final, p5Rate }) {
      const factor = 1 + p5Rate / 100;
      if (factor === 0) {
        return { error: 'Uma variação de -100% não permite recuperar o valor original.' };
      }
      const original = p5Final / factor;
      const difference = p5Final - original;
      return {
        label: 'Valor original',
        value: fmt(original),
        detail: `Com uma variação de ${fmt(p5Rate)}%, o valor inicial era ${fmt(original)} (diferença de ${fmt(difference)}).`,
        steps: [
          'Fórmula: valor original = valor final ÷ (1 + variação ÷ 100)',
          `fator = 1 + (${fmt(p5Rate)} ÷ 100) = ${fmt(factor)}`,
          `valor original = ${fmt(p5Final)} ÷ ${fmt(factor)} = ${fmt(original)}`,
        ],
      };
    },
  },
};

const PLACEHOLDER = {
  label: 'Resultado',
  value: '—',
  detail: 'Preencha os campos para ver o cálculo.',
  steps: [],
};

function boot() {
  const root = $('#calculadora-porcentagem');
  if (!root) return;

  const resultLabel = $('#resultado-rotulo');
  const resultValue = $('#resultado-valor');
  const resultDetail = $('#resultado-detalhe');
  const stepsList = $('#resultado-passos');
  const alertBox = $('#porcentagem-alerta');
  const tabs = $$('.tab', root);
  const panels = $$('.tabpanel', root);

  let mode = 'x-de-y';

  function render(activeMode) {
    const config = MODES[activeMode];
    const values = {};
    const fields = config.fields.map(([id, label]) => {
      const field = readField(id, label);
      values[id] = field.value;
      return { ...field, id, label };
    });

    if (alertBox) {
      alertBox.hidden = true;
      alertBox.textContent = '';
    }

    const parseError = fields.find((field) => field.error);
    const emptyFields = fields.filter((field) => field.empty);

    let output;
    if (parseError) {
      output = {
        label: 'Verifique os dados',
        value: '—',
        detail: parseError.error,
        steps: [],
      };
      if (alertBox) {
        alertBox.hidden = false;
        alertBox.className = 'alert alert--error';
        alertBox.textContent = parseError.error;
      }
    } else if (emptyFields.length === fields.length) {
      output = PLACEHOLDER;
    } else if (emptyFields.length > 0) {
      output = {
        label: 'Quase lá',
        value: '—',
        detail: 'Preencha todos os campos para ver o resultado.',
        steps: [],
      };
    } else {
      const camel = {};
      config.fields.forEach(([id]) => {
        const key = id.replace(/-(\w)/g, (_, letter) => letter.toUpperCase());
        camel[key] = values[id];
      });
      const computed = config.compute(camel);
      if (computed.error) {
        output = { label: 'Não foi possível calcular', value: '—', detail: computed.error, steps: [] };
        if (alertBox) {
          alertBox.hidden = false;
          alertBox.className = 'alert alert--error';
          alertBox.textContent = computed.error;
        }
      } else {
        output = computed;
      }
    }

    if (resultLabel) resultLabel.textContent = output.label;
    if (resultValue) resultValue.textContent = output.value;
    if (resultDetail) resultDetail.textContent = output.detail || '';
    if (stepsList) {
      stepsList.innerHTML = (output.steps || []).map((step) => `<li>${step}</li>`).join('');
      stepsList.closest('[data-passos]')?.toggleAttribute('hidden', !output.steps?.length);
    }
  }

  function selectMode(next) {
    mode = next;
    tabs.forEach((tab) => {
      const active = tab.dataset.mode === next;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== next;
    });
    render(mode);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => selectMode(tab.dataset.mode));
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
        selectMode(target.dataset.mode);
      }
    });
  });

  root.addEventListener('input', (event) => {
    if (event.target.matches('input')) render(mode);
  });

  $('#btn-reset')?.addEventListener('click', () => {
    $$(`.tabpanel[data-panel="${mode}"] input`, root).forEach((input) => {
      input.value = '';
      setFieldError(input, '');
    });
    render(mode);
    $$(`.tabpanel[data-panel="${mode}"] input`, root)[0]?.focus();
    toast('Campos reiniciados.', 'info');
  });

  $('#btn-copiar-resultado')?.addEventListener('click', async () => {
    const value = resultValue?.textContent?.trim();
    if (!value || value === '—') {
      toast('Ainda não há resultado para copiar.', 'warning');
      return;
    }
    const text = `${resultLabel?.textContent || 'Resultado'}: ${value}${resultDetail?.textContent ? ` (${resultDetail.textContent})` : ''}`;
    const ok = await copyText(text);
    toast(ok ? 'Resultado copiado.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
  });

  selectMode('x-de-y');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
