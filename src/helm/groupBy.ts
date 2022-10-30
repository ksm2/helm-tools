export function groupBy<T>(values: T[], grouper: (values: T) => string): { [key: string]: T[] } {
  const groups: { [key: string]: T[] } = {};
  for (const value of values) {
    const group = groups[grouper(value)] ?? [];
    groups[grouper(value)] = group;
    group.push(value);
  }
  return groups;
}
