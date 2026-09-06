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
  return getRussianPhoneDigits(value).length === MAX_RUSSIAN_PHONE_DIGITS;
}

/**
 * Keeps the +7 prefix immutable and makes Backspace skip mask punctuation.
 * Text selections deliberately return null so the browser can perform its
 * normal selected-text deletion before the input formatter runs.
 */
export function getRussianPhoneBackspaceState(value, selectionStart, selectionEnd) {
  if (
    typeof value !== "string" ||
    !Number.isInteger(selectionStart) ||
    !Number.isInteger(selectionEnd) ||
    selectionStart !== selectionEnd
  ) {
    return null;
  }

  const cursor = Math.max(0, Math.min(selectionStart, value.length));
  const nationalDigits = getRussianPhoneDigits(value);

  if (cursor <= 2 || nationalDigits.length === 0) {
    return { value: "+7", caret: 2 };
  }

  const digitsBeforeCursor = getRussianPhoneDigits(value.slice(0, cursor));
  if (digitsBeforeCursor.length === 0) {
    return { value: formatNationalDigits(nationalDigits), caret: 2 };
  }

  const removeIndex = Math.min(digitsBeforeCursor.length, nationalDigits.length) - 1;
  const remainingDigits = nationalDigits.slice(0, removeIndex) + nationalDigits.slice(removeIndex + 1);

  return {
    value: formatNationalDigits(remainingDigits),
    caret: formatNationalDigits(remainingDigits.slice(0, removeIndex)).length,
  };
}
