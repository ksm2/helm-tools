import { groupBy } from '../../src/utils/groupBy.js';

describe('groupBy', () => {
  it('should group an object', () => {
    const fruits = [
      { name: 'apple', color: 'red' },
      { name: 'pear', color: 'green' },
      { name: 'cherry', color: 'red' },
      { name: 'lemon', color: 'yellow' },
    ];

    expect(groupBy(fruits, (fruit) => fruit.color)).toStrictEqual({
      red: [fruits[0], fruits[2]],
      green: [fruits[1]],
      yellow: [fruits[3]],
    });
  });
});
