import { Permission } from '../../src/git/Permission';

describe('Permission', () => {
  it('should support r--', () => {
    const p = new Permission(4);
    expect(p.readable).toBe(true);
    expect(p.writable).toBe(false);
    expect(p.executable).toBe(false);
    expect(p.toString()).toBe('r--');
  });

  it('should support -w-', () => {
    const p = new Permission(2);
    expect(p.readable).toBe(false);
    expect(p.writable).toBe(true);
    expect(p.executable).toBe(false);
    expect(p.toString()).toBe('-w-');
  });

  it('should support --x', () => {
    const p = new Permission(1);
    expect(p.readable).toBe(false);
    expect(p.writable).toBe(false);
    expect(p.executable).toBe(true);
    expect(p.toString()).toBe('--x');
  });

  it('should support rwx', () => {
    const p = new Permission(7);
    expect(p.readable).toBe(true);
    expect(p.writable).toBe(true);
    expect(p.executable).toBe(true);
    expect(p.toString()).toBe('rwx');
  });

  it('should support ---', () => {
    const p = new Permission(0);
    expect(p.readable).toBe(false);
    expect(p.writable).toBe(false);
    expect(p.executable).toBe(false);
    expect(p.toString()).toBe('---');
  });
});
