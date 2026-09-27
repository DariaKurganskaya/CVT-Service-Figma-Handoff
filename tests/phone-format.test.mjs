import assert from "node:assert/strict";
import test from "node:test";

import {
  formatRussianPhone,
  getRussianPhoneBackspaceState,
  getRussianPhoneChangeState,
  getRussianPhoneDeletionState,
  getRussianPhonePasteState,
  getRussianPhoneDigits,
  isCompleteRussianPhone,
} from "../app/phone.js";

test("formats regular typing and pasted digits into the API phone format", () => {
  assert.equal(formatRussianPhone("9991234567"), "+7 (999) 123-45-67");
  assert.equal(formatRussianPhone("+7 999 123 45 67"), "+7 (999) 123-45-67");
  assert.equal(formatRussianPhone("8 (999) 123-45-67"), "+7 (999) 123-45-67");
});

test("submission rejects letters, extra digits, and partial values without truncating them", () => {
  for (const value of ["97", "67", "49771798", "", "+7 (999) 999-99", "+7 (999) 123-45-678", "+7 (999) 123-45-67abc"]) {
    assert.equal(isCompleteRussianPhone(value), false, value);
  }
});

test("Backspace preserves prefix and remaining digits; selection deletes only selected digits", () => {
  const value = "+7 (999) 123-45-67";
  for (const caret of [0, 1, 2, 3, 4]) {
    assert.equal(getRussianPhoneBackspaceState(value, caret, caret).value, value);
  }
  assert.deepEqual(getRussianPhoneBackspaceState(value, 0, value.length), { value: "+7", caret: 2 });
  assert.equal(getRussianPhoneDeletionState(value, 5, 7).value, "+7 (912) 345-67");
});

test("Delete skips automatic punctuation and removes the next digit, with a stable caret", () => {
  const value = "+7 (999) 123-45-67";
  const result = getRussianPhoneDeletionState(value, 7, 7, "forward");
  assert.equal(result.value, "+7 (999) 234-56-7");
  assert.equal(result.caret, 7);
  assert.equal(getRussianPhoneDeletionState(value, value.length, value.length, "forward").value, value);
  assert.equal(getRussianPhoneDeletionState(value, 2, 2, "forward").value, "+7 (991) 234-56-7");
});

test("mobile input deletion of the inserted parenthesis removes a digit", () => {
  assert.deepEqual(getRussianPhoneChangeState("+7 (999)", "+7 (999", 7, "deleteContentBackward"), { value: "+7 (99", caret: 6 });
  assert.deepEqual(getRussianPhoneChangeState("+7 (999) 123", "+7 (999 123", 7, "deleteContentForward"), { value: "+7 (999) 23", caret: 7 });
});

test("paste normalizes full numbers without duplicating prefix, and replaces a selected part", () => {
  for (const value of ["8 (999) 123-45-67", "7 999 123 45 67", "+7 (999) 123-45-67", "9991234567"]) {
    assert.equal(getRussianPhonePasteState("+7", 2, 2, value).value, "+7 (999) 123-45-67");
  }
  assert.deepEqual(getRussianPhonePasteState("+7 (999) 123-45-67", 9, 12, "456"), { value: "+7 (999) 456-45-67", caret: 12 });
  assert.equal(getRussianPhonePasteState("+7", 2, 2, "abc9991234567").value, "+7");
  assert.equal(getRussianPhonePasteState("+7", 2, 2, "+7999123456789").value, "+7 (999) 123-45-67");
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
