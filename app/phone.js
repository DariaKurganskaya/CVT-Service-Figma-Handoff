const MAX_RUSSIAN_PHONE_DIGITS = 10;

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
  const digits = getRussianPhoneDigits(value);

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

export function isCompleteRussianPhone(value) {
  return getRussianPhoneDigits(value).length === MAX_RUSSIAN_PHONE_DIGITS;
}
