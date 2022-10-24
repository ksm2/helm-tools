import { Mode } from '../../src/git/Mode';
import { Permission } from '../../src/git/Permission';

describe('Mode', () => {
  it('should support 777', () => {
    const mode = new Mode(0o777);
    expect(mode.user).toStrictEqual(new Permission(7));
    expect(mode.group).toStrictEqual(new Permission(7));
    expect(mode.other).toStrictEqual(new Permission(7));
    expect(mode.toString()).toBe('rwxrwxrwx');
  });

  it('should support 644', () => {
    const mode = new Mode(0o644);
    expect(mode.user).toStrictEqual(new Permission(6));
    expect(mode.group).toStrictEqual(new Permission(4));
    expect(mode.other).toStrictEqual(new Permission(4));
    expect(mode.toString()).toBe('rw-r--r--');
  });

  it('should support 400', () => {
    const mode = new Mode(0o400);
    expect(mode.user).toStrictEqual(new Permission(4));
    expect(mode.group).toStrictEqual(new Permission(0));
    expect(mode.other).toStrictEqual(new Permission(0));
    expect(mode.toString()).toBe('r--------');
  });
});
