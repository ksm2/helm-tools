#!/usr/bin/env node
import { program } from 'commander';
import 'source-map-support/register';

import { bump } from './commands/bump';
import { indexCommand } from './commands/indexCommand';
import { pack } from './commands/pack';
import { Output } from './output/Output';
import { curry } from './utils/curry';

const { version } = require('../package.json');

const output = new Output();

program
  .name('helm-tools')
  .description('CLI tool to interact with Helm Charts')
  .version(version)
  .option('-o, --output <format>', 'specifies how to output details', 'auto');

program.on('option:output', (format) => {
  output.format = format;
});

program.command('bump').argument('chart', 'Location of the Helm Chart').action(curry(bump)(output));
program.command('pack').argument('chart', 'Location of the Helm Chart').action(curry(pack)(output));
program
  .command('index')
  .argument('location', 'Location of the Helm Chart Index')
  .requiredOption('-c, --chart <tar>', 'the chart to add to the index')
  .option('-u, --url <urls...>', 'add a URL for the chart', [])
  .action(curry(indexCommand)(output));

program.parse();
