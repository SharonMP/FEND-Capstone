import { areDatesValid } from './formHandler';

test('Test date validation', () => {
  expect(areDatesValid(new Date('2020-05-01'), new Date('2020-04-01'))).toBe(false);
});