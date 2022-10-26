import process from 'node:process';

export function writeProperties(record: { [key: string]: string }): void {
  process.stdout.write(formatProperties(record));
}

export function formatProperties(record: { [p: string]: string }): string {
  return Object.entries(record)
    .map(([key, value]) => `${key}=${value}\n`)
    .join('');
}
