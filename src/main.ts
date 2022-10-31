#!/usr/bin/env node
import { program } from 'commander';
import fs from 'node:fs';
import sourceMapSupport from 'source-map-support';

import { bump } from './commands/bump.js';
import { indexCommand } from './commands/indexCommand.js';
import { pack } from './commands/pack.js';
import { Output } from './output/Output.js';
import { curry } from './utils/curry.js';

sourceMapSupport.install();

const output = new Output();
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

program
  .name('helm-tools')
  .description('CLI tool to interact with Helm Charts')
  .version(pkg.version)
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
