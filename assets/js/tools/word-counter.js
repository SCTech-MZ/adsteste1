/**
 * Tool: Contador de Palavras e Caracteres.
 * Runs entirely in the browser; the text never leaves the page.
 */

import { $, $$, copyText, formatNumber, plural, toast } from '../utils.js';

const READING_WORDS_PER_MINUTE = 200;

/** Split text into meaningful words (letters/numbers, ignoring punctuation). */
function extractWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\s+/)
    .map((token) => token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''))
    .filter(Boolean);
}

/** Count sentences using the usual Portuguese terminators. */
function countSentences(text) {
  if (!text.trim()) return 0;
  const matches = text.match(/[^.!?…]+[.!?…]+(\s|$)|[^.!?…]+$/g);
  return matches ? matches.filter((sentence) => /\p{L}|\p{N}/u.test(sentence)).length : 0;
}

/** Paragraphs are blocks separated by one or more blank lines. */
function countParagraphs(text) {
  if (!text.trim()) return 0;
  return text
    .trim()
    .split(/\n\s*\n+/)
    .filter((block) => block.trim() !== '').length;
}

function formatReadingTime(words) {
  if (words === 0) return '0 min';
  const minutes = words / READING_WORDS_PER_MINUTE;
  if (minutes < 1) {
    return `${Math.max(1, Math.round(minutes * 60))} s`;
  }
  return `${Math.max(1, Math.round(minutes))} min`;
}

function analyse(text) {
  const words = extractWords(text);
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
  return {
    words: words.length,
    uniqueWords: uniqueWords.size,
    characters: [...text].length,
    charactersNoSpaces: [...text.replace(/\s/gu, '')].length,
    lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
    paragraphs: countParagraphs(text),
    sentences: countSentences(text),
  };
}

function boot() {
  const input = $('#entrada-texto');
  if (!input) return;

  const output = {
    words: $('#stat-palavras'),
    characters: $('#stat-caracteres'),
    charactersNoSpaces: $('#stat-caracteres-sem-espacos'),
    lines: $('#stat-linhas'),
    paragraphs: $('#stat-paragrafos'),
    sentences: $('#stat-frases'),
    uniqueWords: $('#stat-palavras-unicas'),
    reading: $('#stat-leitura'),
  };
  const announcement = $('#contador-anuncio');

  let frame = null;

  function update() {
    const stats = analyse(input.value);
    const write = (node, value) => {
      if (node) node.textContent = value;
    };

    write(output.words, formatNumber(stats.words));
    write(output.characters, formatNumber(stats.characters));
    write(output.charactersNoSpaces, formatNumber(stats.charactersNoSpaces));
    write(output.lines, formatNumber(stats.lines));
    write(output.paragraphs, formatNumber(stats.paragraphs));
    write(output.sentences, formatNumber(stats.sentences));
    write(output.uniqueWords, formatNumber(stats.uniqueWords));
    write(output.reading, formatReadingTime(stats.words));

    if (announcement) {
      announcement.textContent = `${stats.words} ${plural(stats.words, 'palavra', 'palavras')} e ${stats.characters} ${plural(stats.characters, 'caractere', 'caracteres')}.`;
    }
  }

  function scheduleUpdate() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  }

  input.addEventListener('input', scheduleUpdate);
  input.addEventListener('change', scheduleUpdate);

  $('#btn-limpar')?.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
    toast('Texto removido.', 'info');
  });

  $('#btn-copiar')?.addEventListener('click', async () => {
    if (!input.value.trim()) {
      toast('Não há texto para copiar.', 'warning');
      return;
    }
    const ok = await copyText(input.value);
    toast(ok ? 'Texto copiado.' : 'Não foi possível copiar o texto.', ok ? 'success' : 'error');
  });

  $$('[data-exemplo]').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.dataset.exemplo === 'curto' ? SHORT_SAMPLE : LONG_SAMPLE;
      update();
      input.focus();
    });
  });

  update();
}

const SHORT_SAMPLE = 'O SmartTools Hub reúne ferramentas simples para o dia a dia. Basta escrever e o resultado aparece na hora.';

const LONG_SAMPLE = `A escrita clara começa por frases curtas. Um parágrafo bem construído apresenta uma ideia principal e sustenta-a com detalhes úteis.

Quando o texto cresce, o contador ajuda a manter o foco: sabe quantas palavras escreveu, quanto tempo o leitor vai gastar e se o conteúdo está adequado ao formato.

Experimente colar aqui um artigo, uma publicação para redes sociais ou um trabalho académico. Tudo é processado localmente, no seu navegador, sem enviar dados para nenhum servidor.`;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
