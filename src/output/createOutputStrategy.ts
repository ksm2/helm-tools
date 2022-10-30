import { GithubStrategy } from './GithubStrategy';
import { JsonStrategy } from './JsonStrategy';
import { OutputStrategy } from './OutputStrategy';

export function createOutputStrategy(format: string): OutputStrategy {
  switch (format) {
    case 'github': {
      return new GithubStrategy();
    }
    case 'json': {
      return new JsonStrategy();
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
  if (GithubStrategy.isSupported()) {
    return new GithubStrategy();
  }

  return new JsonStrategy();
}
