type Func<T, U extends any[], V> = (...args: [T, ...U]) => V;

export function curry<T, U extends any[], V>(fn: Func<T, U, V>): (arg0: T) => (...args: U) => V {
  return function curriedFn(arg0) {
    return (...args) => fn(arg0, ...args);
  };
}
