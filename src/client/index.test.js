const app = require('./index');

test('Test addEventListener function exists on the DOM ', () => {
  document.body.innerHTML = '<!doctype html><html><body><form id="form"></form></body></html>';
  expect(typeof document.getElementById('form').addEventListener).toBe( "function" );
});