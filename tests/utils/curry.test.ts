import { curry } from '../../src/utils/curry.js';

describe('curry', () => {
  it('should curry a function', () => {
    function add(a: number, b: number): number {
      return a + b;
    }

    const increment = curry(add)(1);

    expect(add(1, 2)).toBe(3);
    expect(increment(2)).toBe(3);
  });
});
