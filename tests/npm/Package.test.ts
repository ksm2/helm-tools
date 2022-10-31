import { Package } from '../../src/npm/Package';
import type { PackageManifest, Person } from '../../src/npm/PackageManifest';

describe('Package', () => {
  it('should get the author', () => {
    expectAuthor({}, undefined);
    expectAuthor({ author: 'John Doe' }, { name: 'John Doe' });
    expectAuthor(
      { author: 'John Doe <jdoe@example.org>' },
      { name: 'John Doe', email: 'jdoe@example.org' },
    );
    expectAuthor({ author: { name: 'John Doe' } }, { name: 'John Doe' });
    expectAuthor(
      { author: { name: 'John Doe', email: 'jdoe@example.org' } },
      { name: 'John Doe', email: 'jdoe@example.org' },
    );
    expectAuthor(
      { author: { name: 'John Doe', email: 'jdoe@example.org', url: 'https://example.org' } },
      { name: 'John Doe', email: 'jdoe@example.org', url: 'https://example.org' },
    );
  });

  function expectAuthor(actual: Partial<PackageManifest>, expected: Person | undefined): void {
    const p = new Package({ name: 'test', ...actual });
    expect(p.author).toEqual(expected);
  }
});
