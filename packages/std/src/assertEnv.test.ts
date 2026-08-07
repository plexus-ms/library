import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { assertEnv } from './assertEnv.ts';

const touched: string[] = [];

function setEnv(name: string, value: string) {
  touched.push(name);
  process.env[name] = value;
}

afterEach(() => {
  for (const name of touched.splice(0)) delete process.env[name];
});

test('returns the value of a set variable', () => {
  setEnv('STD_TEST_A', 'value-a');
  assert.equal(assertEnv('STD_TEST_A'), 'value-a');
});

test('returns the first variable that is set', () => {
  setEnv('STD_TEST_B', 'value-b');
  assert.equal(assertEnv('STD_TEST_MISSING', 'STD_TEST_B'), 'value-b');
});

test('trims the value and treats a blank variable as missing', () => {
  setEnv('STD_TEST_BLANK', '   ');
  setEnv('STD_TEST_PADDED', '  value  ');
  assert.equal(assertEnv('STD_TEST_BLANK', 'STD_TEST_PADDED'), 'value');
});

test('throws naming a single variable', () => {
  assert.throws(() => assertEnv('STD_TEST_MISSING'), {
    message: 'Missing environment variable STD_TEST_MISSING',
  });
});

test('throws joining two variables with "or"', () => {
  assert.throws(() => assertEnv('AUTH_SECRET', 'BETTER_AUTH_SECRET'), {
    message: 'Missing environment variable AUTH_SECRET or BETTER_AUTH_SECRET',
  });
});

test('throws joining three or more variables with commas and "or"', () => {
  assert.throws(() => assertEnv('APP_URL', 'AUTH_URL', 'BETTER_AUTH_URL', 'VERCEL_URL'), {
    message: 'Missing environment variable APP_URL, AUTH_URL, BETTER_AUTH_URL, or VERCEL_URL',
  });
});

test('appends the hint after a colon', () => {
  assert.throws(() => assertEnv('AUTH_SECRET', 'BETTER_AUTH_SECRET', { hint: 'use `pnx auth secret` to generate' }), {
    message: 'Missing environment variable AUTH_SECRET or BETTER_AUTH_SECRET: use `pnx auth secret` to generate',
  });
});

test('an options argument without a hint does not affect the message', () => {
  assert.throws(() => assertEnv('STD_TEST_MISSING', {}), {
    message: 'Missing environment variable STD_TEST_MISSING',
  });
});
