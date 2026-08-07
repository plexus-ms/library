export interface AssertEnvOptions {
  /** Appended to the error message after a colon, e.g. how to obtain the value. */
  hint?: string;
}

/**
 * Read the first environment variable that is set, or throw.
 *
 * Names are tried in order; a variable that is unset or empty (whitespace only)
 * counts as missing. The returned value is trimmed.
 *
 * @example assertEnv('AUTH_SECRET', 'BETTER_AUTH_SECRET', { hint: 'use `pnx auth secret` to generate' })
 * // throws: Missing environment variable AUTH_SECRET or BETTER_AUTH_SECRET: use `pnx auth secret` to generate
 */
export function assertEnv(...names: [string, ...string[]]): string;
export function assertEnv(...args: [string, ...string[], AssertEnvOptions]): string;
export function assertEnv(...args: (string | AssertEnvOptions)[]): string {
  const last = args.at(-1);
  const options = typeof last === 'object' ? last : undefined;
  const names = (options ? args.slice(0, -1) : args) as string[];

  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }

  const hint = options?.hint ? `: ${options.hint}` : '';
  throw new Error(`Missing environment variable ${formatList(names)}${hint}`);
}

/** Join with commas and a trailing "or", Oxford-comma style: "A", "A or B", "A, B, or C". */
function formatList(names: string[]): string {
  if (names.length <= 1) return names.join('');
  if (names.length === 2) return names.join(' or ');
  return `${names.slice(0, -1).join(', ')}, or ${names.at(-1)}`;
}
