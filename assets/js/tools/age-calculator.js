/**
 * Tool: Calculadora de Idade.
 * Computes the exact age in years, months and days plus totals, the next
 * birthday and the number of leap days lived. All date arithmetic is done on
 * calendar days (local midnight / UTC stamps) so daylight saving time never
 * shifts a result by one day.
 */

import {
  $,
  LOCALE,
  copyText,
  daysInMonth,
  formatNumber,
  parseLocalDate,
  setFieldError,
  toast,
  today,
} from '../utils.js';

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Calendar day stamp (UTC) used for exact day differences. */
function dayStamp(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(from, to) {
  return Math.round((dayStamp(to) - dayStamp(from)) / 86400000);
}

/**
 * Difference broken into years, months and days.
 * Anchors on the most recent anniversary (with 29 February clamped to the last
 * day of February in common years) so the result stays consistent with the
 * "next birthday" shown next to it.
 */
function diffInYearsMonthsDays(from, to) {
  let anniversaryYear = to.getFullYear();
  let anniversary = birthdayInYear(from, anniversaryYear);
  if (dayStamp(anniversary) > dayStamp(to)) {
    anniversaryYear -= 1;
    anniversary = birthdayInYear(from, anniversaryYear);
  }

  const years = anniversaryYear - from.getFullYear();
  let months = to.getMonth() - anniversary.getMonth();
  let days = to.getDate() - anniversary.getDate();

  if (days < 0) {
    months -= 1;
    // Last day of the month preceding `to` (handles January → December).
    days += daysInMonth(to.getFullYear(), to.getMonth());
  }
  if (months < 0) {
    months += 12;
  }
  return { years, months, days };
}

/** Birthday of `birth` inside a given year, handling 29 February. */
function birthdayInYear(birth, year) {
  const month = birth.getMonth();
  const day = birth.getDate();
  if (month === 1 && day === 29 && !isLeapYear(year)) {
    return new Date(year, 1, 28);
  }
  return new Date(year, month, day);
}

function nextBirthday(birth, reference) {
  let year = reference.getFullYear();
  let candidate = birthdayInYear(birth, year);
  if (dayStamp(candidate) < dayStamp(reference)) {
    year += 1;
    candidate = birthdayInYear(birth, year);
  }
  return candidate;
}

/** Number of 29 February dates lived between two dates. */
function leapDaysLived(from, to) {
  let count = 0;
  for (let year = from.getFullYear(); year <= to.getFullYear(); year += 1) {
    if (!isLeapYear(year)) continue;
    const february29 = new Date(year, 1, 29);
    if (dayStamp(february29) >= dayStamp(from) && dayStamp(february29) <= dayStamp(to)) {
      count += 1;
    }
  }
  return count;
}

function formatWeekday(date) {
  return new Intl.DateTimeFormat(LOCALE, { weekday: 'long' }).format(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function boot() {
  const birthInput = $('#data-nascimento');
  if (!birthInput) return;

  const referenceInput = $('#data-referencia');
  const resultBox = $('#idade-resultado');
  const resultValue = $('#resultado-idade');
  const resultDetail = $('#resultado-idade-detalhe');
  const alertBox = $('#idade-alerta');
  const stepsBox = $('#idade-passos');

  const stats = {
    days: $('#stat-idade-dias'),
    weeks: $('#stat-idade-semanas'),
    months: $('#stat-idade-meses'),
    hours: $('#stat-idade-horas'),
    weekday: $('#stat-dia-semana'),
    birthday: $('#stat-proximo-aniversario'),
    countdown: $('#stat-dias-aniversario'),
    leap: $('#stat-bissextos'),
  };

  if (referenceInput && !referenceInput.value) {
    const now = today();
    referenceInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function setAlert(message, type = 'error') {
    if (!alertBox) return;
    if (!message) {
      alertBox.hidden = true;
      alertBox.textContent = '';
      return;
    }
    alertBox.className = `alert alert--${type}`;
    alertBox.textContent = message;
    alertBox.hidden = false;
  }

  function resetOutputs() {
    if (resultValue) resultValue.textContent = '—';
    if (resultDetail) resultDetail.textContent = 'Introduza a sua data de nascimento para calcular.';
    Object.values(stats).forEach((node) => {
      if (node) node.textContent = '—';
    });
    if (stepsBox) stepsBox.innerHTML = '';
  }

  function calculate() {
    const birth = parseLocalDate(birthInput.value);
    const reference = parseLocalDate(referenceInput?.value) || today();

    setFieldError(birthInput, '');
    if (referenceInput) setFieldError(referenceInput, '');
    setAlert('');

    if (!birthInput.value.trim()) {
      resetOutputs();
      return;
    }

    if (!birth) {
      setFieldError(birthInput, 'A data introduzida não é válida.');
      setAlert('A data de nascimento não é válida. Use o formato dia/mês/ano.');
      resetOutputs();
      return;
    }

    if (birthInput.value && referenceInput?.value && !reference) {
      setFieldError(referenceInput, 'A data de referência não é válida.');
      setAlert('A data de referência não é válida.');
      resetOutputs();
      return;
    }

    if (dayStamp(birth) > dayStamp(reference)) {
      setFieldError(birthInput, 'A data de nascimento não pode estar no futuro.');
      setAlert(
        'A data de nascimento está no futuro. Escolha uma data anterior à data de referência.',
      );
      resetOutputs();
      return;
    }

    const { years, months, days } = diffInYearsMonthsDays(birth, reference);
    const totalDays = daysBetween(birth, reference);
    const totalMonths = years * 12 + months;
    const leapDays = leapDaysLived(birth, reference);
    const isToday = days === 0 && months === 0 && years >= 0 && dayStamp(birth) !== dayStamp(reference);

    const birthday = nextBirthday(birth, reference);
    const daysToBirthday = daysBetween(reference, birthday);
    const isBirthdayToday =
      birthday.getMonth() === reference.getMonth() && birthday.getDate() === reference.getDate();

    const parts = [];
    if (years > 0) parts.push(`${formatNumber(years)} ${years === 1 ? 'ano' : 'anos'}`);
    if (months > 0) parts.push(`${formatNumber(months)} ${months === 1 ? 'mês' : 'meses'}`);
    if (days > 0 || parts.length === 0) {
      parts.push(`${formatNumber(days)} ${days === 1 ? 'dia' : 'dias'}`);
    }

    if (resultValue) resultValue.textContent = parts.join(', ');
    if (resultDetail) {
      if (isBirthdayToday) {
        resultDetail.textContent = 'Hoje é o seu aniversário. Parabéns!';
      } else if (isToday) {
        resultDetail.textContent = `Nasceu em ${formatDate(birth)} (${formatWeekday(birth)}).`;
      } else {
        resultDetail.textContent = `Nasceu em ${formatDate(birth)} e a referência é ${formatDate(reference)}.`;
      }
    }

    if (stats.days) stats.days.textContent = formatNumber(totalDays);
    if (stats.weeks) stats.weeks.textContent = formatNumber(Math.floor(totalDays / 7));
    if (stats.months) stats.months.textContent = formatNumber(totalMonths);
    if (stats.hours) stats.hours.textContent = formatNumber(totalDays * 24);
    if (stats.weekday) stats.weekday.textContent = formatWeekday(birth);
    if (stats.birthday) {
      stats.birthday.textContent = formatDate(birthday);
      stats.birthday.title = formatWeekday(birthday);
    }
    if (stats.countdown) {
      stats.countdown.textContent = isBirthdayToday
        ? 'Hoje'
        : `${formatNumber(daysToBirthday)} ${daysToBirthday === 1 ? 'dia' : 'dias'}`;
    }
    if (stats.leap) stats.leap.textContent = formatNumber(leapDays);

    if (stepsBox) {
      stepsBox.innerHTML = [
        `Anos completos: ${formatNumber(years)}`,
        `Meses completos depois do último aniversário: ${formatNumber(months)}`,
        `Dias adicionais: ${formatNumber(days)}`,
        `Total de dias vividos: ${formatNumber(totalDays)} (${formatNumber(Math.floor(totalDays / 7))} semanas)`,
        `Fórmula: idade = data de referência − data de nascimento, contada em anos, meses e dias de calendário`,
      ]
        .map((step) => `<li>${step}</li>`)
        .join('');
    }

    if (resultBox) resultBox.classList.remove('is-empty');
  }

  birthInput.addEventListener('change', calculate);
  birthInput.addEventListener('input', calculate);
  referenceInput?.addEventListener('change', calculate);
  referenceInput?.addEventListener('input', calculate);

  $('#btn-hoje')?.addEventListener('click', () => {
    const now = today();
    if (referenceInput) {
      referenceInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    calculate();
  });

  $('#btn-limpar-idade')?.addEventListener('click', () => {
    birthInput.value = '';
    setFieldError(birthInput, '');
    setAlert('');
    resetOutputs();
    birthInput.focus();
    toast('Datas removidas.', 'info');
  });

  $('#btn-copiar-idade')?.addEventListener('click', async () => {
    const value = resultValue?.textContent?.trim();
    if (!value || value === '—') {
      toast('Ainda não há resultado para copiar.', 'warning');
      return;
    }
    const text = `Idade: ${value}. ${resultDetail?.textContent || ''}`.trim();
    const ok = await copyText(text);
    toast(ok ? 'Resultado copiado.' : 'Não foi possível copiar.', ok ? 'success' : 'error');
  });

  if (birthInput.value) calculate();
  else resetOutputs();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
