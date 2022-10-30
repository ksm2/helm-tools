export function formatDate(date: Date): string {
  const year = print(date.getFullYear(), 4);
  const month = print(date.getMonth() + 1, 2);
  const day = print(date.getDate(), 2);
  const hours = print(date.getHours(), 2);
  const minutes = print(date.getMinutes(), 2);
  const seconds = print(date.getSeconds(), 2);
  const nanos = print(date.getMilliseconds() * 1e6, 9);
  const tz = printTimeZone(date.getTimezoneOffset());
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${nanos}${tz}`;
}

function printTimeZone(offset: number): string {
  const [h, m] = intDivRem(Math.abs(offset), 60);
  const sign = offset > 0 ? '-' : '+';
  const hours = print(h, 2);
  const minutes = print(m, 2);
  return `${sign}${hours}:${minutes}`;
}

function intDivRem(int: number, divisor: number): [number, number] {
  return [Math.floor(int / divisor), int % divisor];
}

function print(num: number, digits: number): string {
  return num.toString(10).padStart(digits, '0');
}
