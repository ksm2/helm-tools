import { GithubStrategy } from './GithubStrategy.js';
import { JsonStrategy } from './JsonStrategy.js';
import type { OutputStrategy } from './OutputStrategy.js';
import { SilentStrategy } from './SilentStrategy.js';
import { TtyStrategy } from './TtyStrategy.js';

export function createOutputStrategy(format: string): OutputStrategy {
  switch (format) {
    case 'github': {
      return new GithubStrategy();
    }
    case 'json': {
      return new JsonStrategy();
    }
    case 'silent': {
      return new SilentStrategy();
    }
    case 'tty': {
      return new TtyStrategy();
    }
    default: {
      const strategy = createAutoOutputStrategy();
      if (format !== 'auto') {
        strategy.printWarning(`Unsupported output format "${format}". Falling back to "auto".`);
      }
      return strategy;
    }
  }
}

function createAutoOutputStrategy(): OutputStrategy {
  if (TtyStrategy.isSupported()) {
    return new TtyStrategy();
  } else if (GithubStrategy.isSupported()) {
    return new GithubStrategy();
  } else {
    return new JsonStrategy();
  }
}
