const MAX_RUSSIAN_PHONE_DIGITS = 10;

function formatNationalDigits(digits) {
  if (digits.length === 0) {
    return "+7";
  }

  let formatted = "+7 (" + digits.slice(0, 3);
  if (digits.length >= 3) {
    formatted += ")";
  }
  if (digits.length > 3) {
    formatted += " " + digits.slice(3, 6);
  }
  if (digits.length > 6) {
    formatted += "-" + digits.slice(6, 8);
  }
  if (digits.length > 8) {
    formatted += "-" + digits.slice(8, 10);
  }

  return formatted;
}

/**
 * Returns the ten national digits of a Russian phone number.
 * A leading 7 or 8 is treated as the country/trunk prefix.
 */
export function getRussianPhoneDigits(value) {
  if (typeof value !== "string") {
    return "";
  }

  const digits = value.replace(/\D/g, "");
  const nationalDigits = digits.startsWith("7") || digits.startsWith("8")
    ? digits.slice(1)
    : digits;

  return nationalDigits.slice(0, MAX_RUSSIAN_PHONE_DIGITS);
}

/** Formats any phone input into the single API format: +7 (999) 999-99-99. */
export function formatRussianPhone(value) {
  return formatNationalDigits(getRussianPhoneDigits(value));
}

export function isCompleteRussianPhone(value) {
  return typeof value === "string" && /^\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value);
}

function caretAfterDigits(value, count) {
  if (count <= 0) return 2;
  const positions = [...value.matchAll(/[0-9]/g)].slice(1);
  return positions[Math.min(count, positions.length) - 1]?.index + 1 || 2;
}

/** Keep the caret next to the edited digit, not at the end of a reformatted value. */
export function getRussianPhoneInputState(raw, caret = raw.length) {
  const value = formatRussianPhone(raw);
  const before = getRussianPhoneDigits(raw.slice(0, caret)).length;
  return { value, caret: caret >= raw.length ? value.length : caretAfterDigits(value, before) };
}

/** Delete digits, not auto-inserted punctuation; never erase the immutable prefix. */
export function getRussianPhoneDeletionState(value, selectionStart, selectionEnd, direction = "backward") {
  if (
    typeof value !== "string" ||
    !Number.isInteger(selectionStart) ||
    !Number.isInteger(selectionEnd)
  ) {
    return null;
  }

  const start = Math.max(2, Math.min(selectionStart, value.length));
  const end = Math.max(start, Math.min(selectionEnd, value.length));
  const digits = getRussianPhoneDigits(value);
  const positions = [...value.matchAll(/[0-9]/g)].slice(1).map((match) => match.index);
  let first = positions.filter((index) => index < start).length;
  let last = positions.filter((index) => index < end).length;
  if (first === last) {
    if (direction === "backward") first = Math.max(0, first - 1);
    else last = Math.min(digits.length, last + 1);
  }
  if (selectionStart === selectionEnd && direction === "backward" && start <= 4) {
    first = 0;
    last = 0;
  }
  const next = formatNationalDigits(digits.slice(0, first) + digits.slice(last));
  return { value: next, caret: caretAfterDigits(next, first) };
}

export function getRussianPhoneBackspaceState(value, start, end) {
  return getRussianPhoneDeletionState(value, start, end, "backward");
}

/** Covers mobile keyboards which emit input events without a Backspace keydown. */
export function getRussianPhoneChangeState(previous, raw, caret, inputType) {
  if (/^deleteContent(Backward|Forward)$/.test(inputType ?? "") && raw !== previous && getRussianPhoneDigits(previous) === getRussianPhoneDigits(raw)) {
    let start = 0;
    while (start < raw.length && raw[start] === previous[start]) start++;
    const backward = inputType === "deleteContentBackward";
    const cursor = backward ? start + previous.length - raw.length : start;
    return getRussianPhoneDeletionState(previous, cursor, cursor, backward ? "backward" : "forward") ?? getRussianPhoneInputState(raw, caret);
  }
  return getRussianPhoneInputState(raw, caret);
}

export function getRussianPhonePasteState(value, start, end, pasted) {
  if (!/^[+0-9\s()-]+$/.test(pasted)) return { value, caret: start };
  const digits = pasted.replace(/\D/g, "");
  if ((/^[78]/.test(digits) && digits.length >= 11) || (start < 2 && end >= value.length)) {
    const next = formatRussianPhone(pasted);
    return { value: next, caret: next.length };
  }
  const raw = value.slice(0, Math.max(2, start)) + digits + value.slice(Math.max(2, end));
  return getRussianPhoneInputState(raw, Math.max(2, start) + digits.length);
}
