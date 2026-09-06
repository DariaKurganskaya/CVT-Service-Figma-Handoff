import assert from "node:assert/strict";
import test from "node:test";

import {
  formatRussianPhone,
  getRussianPhoneBackspaceState,
  getRussianPhoneDigits,
  isCompleteRussianPhone,
} from "../app/phone.js";

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

test("Backspace removes a national digit instead of re-inserting the automatic closing parenthesis", () => {
  let value = formatRussianPhone("999");
  let caret = value.length;

  const firstBackspace = getRussianPhoneBackspaceState(value, caret, caret);
  assert.deepEqual(firstBackspace, { value: "+7 (99", caret: 6 });
  assert.equal(getRussianPhoneDigits(firstBackspace.value), "99");

  value = firstBackspace.value;
  caret = firstBackspace.caret;
  const secondBackspace = getRussianPhoneBackspaceState(value, caret, caret);
  assert.deepEqual(secondBackspace, { value: "+7 (9", caret: 5 });

  const thirdBackspace = getRussianPhoneBackspaceState(secondBackspace.value, secondBackspace.caret, secondBackspace.caret);
  assert.deepEqual(thirdBackspace, { value: "+7", caret: 2 });
});
