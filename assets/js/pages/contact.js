/**
 * SmartTools Hub - contact form.
 * The first version has no backend: the form validates every field locally and
 * then hands the message to the visitor's email client. Nothing is uploaded to
 * our servers. Set `data-endpoint` on the form to switch to a real POST later.
 */

import { $, setFieldError, clearErrors, showAlert, hideAlert, toast } from '../utils.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(input, message) {
  setFieldError(input, message);
}

function validate(form) {
  clearErrors(form);
  let firstInvalid = null;

  const name = form.elements.nome;
  const email = form.elements.email;
  const subject = form.elements.assunto;
  const message = form.elements.mensagem;
  const consent = form.elements.consentimento;
  const page = form.elements.pagina;

  const fail = (input, text) => {
    setError(input, text);
    if (!firstInvalid) firstInvalid = input;
  };

  const nameValue = name.value.trim();
  if (!nameValue) fail(name, 'Indique o seu nome.');
  else if (nameValue.length < 2) fail(name, 'O nome deve ter pelo menos 2 caracteres.');

  const emailValue = email.value.trim();
  if (!emailValue) fail(email, 'Indique o seu endereço de email.');
  else if (!EMAIL_RE.test(emailValue)) fail(email, 'Introduza um endereço de email válido (ex.: nome@exemplo.com).');

  if (!subject.value) fail(subject, 'Selecione o assunto da mensagem.');

  const messageValue = message.value.trim();
  if (!messageValue) fail(message, 'Escreva a sua mensagem.');
  else if (messageValue.length < 20) fail(message, `A mensagem deve ter pelo menos 20 caracteres (tem ${messageValue.length}).`);

  if (page.value.trim()) {
    try {
      const parsed = new URL(page.value.trim());
      if (!/^https?:$/.test(parsed.protocol)) throw new Error('protocol');
    } catch {
      fail(page, 'Indique um endereço válido que comece por http:// ou https://.');
    }
  }

  if (!consent.checked) {
    setFieldError(consent, 'É necessário aceitar a Política de Privacidade para continuar.');
    if (!firstInvalid) firstInvalid = consent;
  }

  return firstInvalid;
}

function buildMailto(form) {
  const email = (form.dataset.contactEmail || 'contacto@smarttoolshub.com').trim();
  const lines = [
    `Nome: ${form.elements.nome.value.trim()}`,
    `Email: ${form.elements.email.value.trim()}`,
    `Assunto: ${form.elements.assunto.options[form.elements.assunto.selectedIndex].textContent.trim()}`,
  ];
  const page = form.elements.pagina.value.trim();
  if (page) lines.push(`Página: ${page}`);
  lines.push('', form.elements.mensagem.value.trim());

  const subject = `[SmartTools Hub] ${form.elements.assunto.options[form.elements.assunto.selectedIndex].textContent.trim()}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function init() {
  const form = $('#contact-form');
  if (!form) return;

  const status = $('#contact-status');

  form.addEventListener('input', (event) => {
    const input = event.target;
    if (input?.matches?.('input, select, textarea') && input.getAttribute('aria-invalid') === 'true') {
      setError(input, '');
    }
  });

  form.addEventListener('reset', () => {
    clearErrors(form);
    hideAlert(status);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideAlert(status);

    const firstInvalid = validate(form);
    if (firstInvalid) {
      showAlert(status, 'Verifique os campos assinalados antes de enviar a mensagem.', 'error');
      firstInvalid.focus();
      return;
    }

    if (form.elements.website.value) {
      /* Honeypot filled: treat silently as success for bots. */
      showAlert(status, 'Mensagem recebida. Obrigado!', 'success');
      form.reset();
      return;
    }

    const endpoint = (form.dataset.endpoint || '').trim();
    if (!endpoint) {
      window.location.href = buildMailto(form);
      showAlert(
        status,
        'Abrimos o seu programa de email com a mensagem preenchida. Se nada acontecer, envie diretamente para contacto@smarttoolshub.com.',
        'success',
      );
      toast('Formulário validado. A abrir o email…', 'success');
      return;
    }

    const payload = new FormData(form);
    payload.delete('website');
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;

    fetch(endpoint, { method: 'POST', body: payload })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        showAlert(status, 'Mensagem enviada com sucesso. Responderemos em breve.', 'success');
        form.reset();
        toast('Mensagem enviada.', 'success');
      })
      .catch(() => {
        showAlert(status, 'Não foi possível enviar a mensagem. Tente novamente ou escreva para contacto@smarttoolshub.com.', 'error');
        toast('Falha no envio.', 'error');
      })
      .finally(() => {
        if (submit) submit.disabled = false;
      });
  });

  const urlInput = form.elements.pagina;
  if (urlInput) {
    const prefilled = new URLSearchParams(window.location.search).get('pagina');
    if (prefilled) urlInput.value = prefilled;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
