/**
 * Tool: Formatador e Validador JSON.
 * Uses JSON.parse / JSON.stringify only - never eval. Everything is processed
 * in the browser, so sensitive payloads never leave the user's machine.
 */

import { $, copyText, formatNumber, toast, hideAlert, showAlert } from '../utils.js';

/* ----------------------------- Error reporting --------------------------- */

const FRIENDLY_MESSAGES = [
  [
    /unexpected end of json input|unterminated/i,
    'O JSON termina de forma inesperada: faltam dados ou fechar chaves/parênteses retos.',
  ],
  [
    /unexpected non-whitespace character after json/i,
    'Existe conteúdo extra depois do fim do JSON. Cada documento só pode ter um valor na raiz.',
  ],
  [
    /expected property name or '}'/i,
    'Era esperado o nome de uma propriedade entre aspas duplas, ou o fecho do objeto.',
  ],
  [
    /expected double-quoted property name/i,
    'Os nomes das propriedades têm de estar entre aspas duplas.',
  ],
  [
    /expected ',' or '}'|expected ',' or ']'/i,
    'Falta uma vírgula entre elementos ou o fecho do objeto/array.',
  ],
  [
    /unexpected token/i,
    'Foi encontrado um símbolo inesperado. Verifique vírgulas a mais, aspas por fechar ou comentários.',
  ],
  [
    /bad control character/i,
    'Existe um carácter de controlo inválido (por exemplo uma quebra de linha dentro de uma string).',
  ],
  [
    /bad escaped character/i,
    'Existe uma sequência de escape inválida dentro de uma string (use \\\\, \\", \\n, \\t, \\uXXXX…).',
  ],
];

/** Extract position/line/column information from a JSON.parse error. */
function describeError(error, text) {
  const original = String(error?.message || error);
  const info = { message: original, position: null, line: null, column: null };

  const positionMatch = /position (\d+)/i.exec(original);
  if (positionMatch) info.position = Number(positionMatch[1]);

  const lineColumnMatch = /line (\d+)\s*[,;]?\s*(?:column )?(\d+)?/i.exec(original);
  if (lineColumnMatch) {
    info.line = Number(lineColumnMatch[1]);
    if (lineColumnMatch[2]) info.column = Number(lineColumnMatch[2]);
  }

  if (info.position === null && info.line !== null && info.column !== null) {
    const lines = text.split('\n');
    let position = 0;
    for (let index = 0; index < info.line - 1 && index < lines.length; index += 1) {
      position += lines[index].length + 1;
    }
    info.position = position + (info.column - 1);
  }

  if (info.position !== null && (info.line === null || info.column === null)) {
    const before = text.slice(0, info.position);
    const lines = before.split('\n');
    info.line = lines.length;
    info.column = lines[lines.length - 1].length + 1;
  }

  const friendly = FRIENDLY_MESSAGES.find(([pattern]) => pattern.test(original));
  info.friendly = friendly ? friendly[1] : 'O JSON não é válido.';

  return info;
}

/** Build a short excerpt of the offending line with a caret marker. */
function buildSnippet(text, line, column) {
  if (!line || !column) return '';
  const lines = text.split('\n');
  const content = lines[line - 1];
  if (content === undefined) return '';

  const start = Math.max(0, column - 41);
  const end = Math.min(content.length, column + 40);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < content.length ? '…' : '';
  const visible = content.slice(start, end);
  const caretOffset = prefix.length + (column - 1 - start);

  return `Linha ${line}, coluna ${column}:\n${prefix}${visible}${suffix}\n${' '.repeat(caretOffset)}^`;
}

/* -------------------------------- Analysis ------------------------------- */

/** Collect statistics about a parsed JSON document. */
function analyse(value) {
  let keys = 0;
  let nodes = 0;
  let depth = 0;

  const walk = (node, level) => {
    nodes += 1;
    depth = Math.max(depth, level);
    if (Array.isArray(node)) {
      node.forEach((item) => walk(item, level + 1));
    } else if (node && typeof node === 'object') {
      Object.keys(node).forEach((key) => {
        keys += 1;
        walk(node[key], level + 1);
      });
    }
  };

  walk(value, 1);

  const rootType = Array.isArray(value)
    ? 'Array'
    : value === null
      ? 'Nulo'
      : typeof value === 'object'
        ? 'Objeto'
        : typeof value === 'string'
          ? 'Texto'
          : typeof value === 'number'
            ? 'Número'
            : typeof value === 'boolean'
              ? 'Booleano'
              : 'Desconhecido';

  return { keys, nodes, depth, rootType };
}

/** Recursively sort object keys alphabetically (arrays keep their order). */
function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((accumulator, key) => {
        accumulator[key] = sortDeep(value[key]);
        return accumulator;
      }, {});
  }
  return value;
}

/* --------------------------------- Wiring -------------------------------- */

function boot() {
  const input = $('#json-entrada');
  if (!input) return;

  const output = $('#json-saida');
  const alertBox = $('#json-alerta');
  const statusBadge = $('#json-estado');
  const indentSelect = $('#json-indent');
  const sortCheckbox = $('#json-sort');
  const statsBox = $('#json-estatisticas');
  const fileInput = $('#json-ficheiro');

  const stats = {
    keys: $('#stat-json-chaves'),
    depth: $('#stat-json-profundidade'),
    nodes: $('#stat-json-nos'),
    size: $('#stat-json-tamanho'),
    root: $('#stat-json-tipo'),
  };

  const PLACEHOLDER = `{
  "ferramenta": "SmartTools Hub",
  "funciona": true,
  "categorias": ["texto", "calculadoras", "conversores"],
  "detalhes": { "privado": true, "servidor": null }
}`;

  function setStatus(state, text) {
    if (!statusBadge) return;
    statusBadge.className = 'badge';
    if (state === 'valid') statusBadge.classList.add('badge--live');
    else if (state === 'invalid') statusBadge.classList.add('badge--soon');
    else statusBadge.classList.add('badge--neutral');
    statusBadge.textContent = text;
  }

  function clearStats() {
    Object.values(stats).forEach((node) => {
      if (node) node.textContent = '—';
    });
    if (statsBox) statsBox.hidden = true;
  }

  function fillStats(value) {
    const info = analyse(value);
    if (stats.keys) stats.keys.textContent = formatNumber(info.keys);
    if (stats.depth) stats.depth.textContent = formatNumber(info.depth);
    if (stats.nodes) stats.nodes.textContent = formatNumber(info.nodes);
    if (stats.size) stats.size.textContent = `${formatNumber(new TextEncoder().encode(input.value).length)} B`;
    if (stats.root) stats.root.textContent = info.rootType;
    if (statsBox) statsBox.hidden = false;
  }

  function parseOrReport(text) {
    try {
      const value = JSON.parse(text);
      return { ok: true, value };
    } catch (error) {
      const info = describeError(error, text);
      if (statusBadge) {
        statusBadge.className = 'badge badge--soon';
        statusBadge.textContent = 'JSON inválido';
      }
      if (alertBox) {
        alertBox.className = 'alert alert--error';
        alertBox.textContent = '';
        const title = document.createElement('strong');
        title.textContent = info.friendly;
        alertBox.appendChild(title);
        const detail = document.createElement('div');
        detail.textContent = `Detalhe técnico: ${info.message}`;
        detail.style.fontSize = '.82rem';
        alertBox.appendChild(detail);
        const snippet = buildSnippet(text, info.line, info.column);
        if (snippet) {
          const pre = document.createElement('pre');
          pre.textContent = snippet;
          alertBox.appendChild(pre);
        }
        alertBox.hidden = false;
      }
      clearStats();
      return { ok: false, info };
    }
  }

  function currentIndent() {
    const value = indentSelect?.value ?? '2';
    return value === 'tab' ? '\t' : Number(value);
  }

  function writeOutput(text) {
    if (output) output.value = text;
  }

  function format() {
    const text = input.value.trim();
    if (!text) {
      if (alertBox) showAlert(alertBox, 'Cole ou escreva um JSON para formatar.', 'info');
      setStatus('idle', 'Sem dados');
      clearStats();
      writeOutput('');
      toast('Introduza um JSON primeiro.', 'warning');
      return;
    }
    const result = parseOrReport(input.value);
    if (!result.ok) {
      writeOutput('');
      toast('JSON inválido. Verifique a mensagem de erro.', 'error');
      return;
    }
    const prepared = sortCheckbox?.checked ? sortDeep(result.value) : result.value;
    writeOutput(JSON.stringify(prepared, null, currentIndent()));
    setStatus('valid', 'JSON válido');
    if (alertBox) showAlert(alertBox, 'JSON válido e formatado com sucesso.', 'success');
    fillStats(result.value);
    toast('JSON formatado.', 'success');
  }

  function minify() {
    const text = input.value.trim();
    if (!text) {
      if (alertBox) showAlert(alertBox, 'Cole ou escreva um JSON para minificar.', 'info');
      toast('Introduza um JSON primeiro.', 'warning');
      return;
    }
    const result = parseOrReport(input.value);
    if (!result.ok) {
      writeOutput('');
      toast('JSON inválido. Verifique a mensagem de erro.', 'error');
      return;
    }
    const prepared = sortCheckbox?.checked ? sortDeep(result.value) : result.value;
    writeOutput(JSON.stringify(prepared));
    setStatus('valid', 'JSON válido');
    if (alertBox) showAlert(alertBox, 'JSON minificado com sucesso.', 'success');
    fillStats(result.value);
    toast('JSON minificado.', 'success');
  }

  function validate() {
    const text = input.value.trim();
    if (!text) {
      if (alertBox) showAlert(alertBox, 'Cole ou escreva um JSON para validar.', 'info');
      setStatus('idle', 'Sem dados');
      clearStats();
      toast('Introduza um JSON primeiro.', 'warning');
      return;
    }
    const result = parseOrReport(input.value);
    if (!result.ok) {
      toast('O JSON contém erros de sintaxe.', 'error');
      return;
    }
    setStatus('valid', 'JSON válido');
    if (alertBox) showAlert(alertBox, 'JSON válido. Nenhum erro de sintaxe encontrado.', 'success');
    fillStats(result.value);
    toast('JSON válido.', 'success');
  }

  $('#btn-formatar')?.addEventListener('click', format);
  $('#btn-minificar')?.addEventListener('click', minify);
  $('#btn-validar')?.addEventListener('click', validate);

  $('#btn-exemplo')?.addEventListener('click', () => {
    input.value = PLACEHOLDER;
    validate();
    input.focus();
  });

  $('#btn-limpar')?.addEventListener('click', () => {
    input.value = '';
    writeOutput('');
    setStatus('idle', 'Sem dados');
    hideAlert(alertBox);
    clearStats();
    input.focus();
    toast('Editor limpo.', 'info');
  });

  $('#btn-copiar-json')?.addEventListener('click', async () => {
    const value = output?.value || input.value;
    if (!value.trim()) {
      toast('Não há conteúdo para copiar.', 'warning');
      return;
    }
    const ok = await copyText(value);
    toast(ok ? 'Conteúdo copiado.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
  });

  fileInput?.addEventListener('change', (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showAlert(alertBox, 'O ficheiro é demasiado grande (limite de 5 MB).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      input.value = String(reader.result || '');
      validate();
    };
    reader.onerror = () => showAlert(alertBox, 'Não foi possível ler o ficheiro.', 'error');
    reader.readAsText(file);
    event.target.value = '';
  });

  /* Live syntax feedback while typing (no auto-reformat, to avoid surprises). */
  let timer = null;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const text = input.value.trim();
      if (!text) {
        setStatus('idle', 'Sem dados');
        clearStats();
        hideAlert(alertBox);
        return;
      }
      try {
        const value = JSON.parse(text);
        setStatus('valid', 'JSON válido');
        hideAlert(alertBox);
        fillStats(value);
      } catch {
        setStatus('invalid', 'JSON inválido');
        clearStats();
      }
    }, 400);
  });

  setStatus('idle', 'Sem dados');
  clearStats();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
