import assert from "node:assert/strict";
import test from "node:test";

import { formatRussianPhone, getRussianPhoneDigits, isCompleteRussianPhone } from "../app/phone.js";

test("formats regular typing and pasted digits into the API phone format", () => {
  assert.equal(formatRussianPhone("9991234567"), "+7 (999) 123-45-67");
  assert.equal(formatRussianPhone("+7 999 123 45 67"), "+7 (999) 123-45-67");
  assert.equal(formatRussianPhone("8 (999) 123-45-67"), "+7 (999) 123-45-67");
});

test("limits input to ten national digits and removes non-digits", () => {
  assert.equal(getRussianPhoneDigits("+7 (999) 123-45-6789abc"), "9991234567");
  assert.equal(formatRussianPhone("abc9!9@9#1$2%3^4&5*6(7"), "+7 (999) 123-45-67");
});

test("keeps deletion states valid for editing but rejects incomplete submission", () => {
  assert.equal(formatRussianPhone("+7 (999) 123-45-"), "+7 (999) 123-45");
  assert.equal(formatRussianPhone(""), "+7");
  assert.equal(isCompleteRussianPhone("+7 (999) 123-45-67"), true);
  assert.equal(isCompleteRussianPhone("+7 (999) 123-45"), false);
});
