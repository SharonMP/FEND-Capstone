import { validateFormInput } from './formHandler';

test('Test input validation empty', () => {
  expect(validateFormInput('')).toBe('empty');
});

test('Test input validation invalid url', () => {
  expect(validateFormInput('abcdef')).toBe('url_parse_error');
});

test('Test input validation ok - subdirectory', () => {
  expect(validateFormInput('http://www.example.com/123')).toBe('ok');
});

test('Test input validation ok - only base', () => {
  expect(validateFormInput('http://www.example.com')).toBe('ok');
});

test('Test input validation ok - no www', () => {
  expect(validateFormInput('https://learn-js.org/')).toBe('ok');
});

test('Test input validation ok - no www', () => {
  expect(validateFormInput('https://www.healthline.com/nutrition/10-proven-benefits-of-cinnamon')).toBe('ok');
});