#!/usr/bin/env node
import { program } from 'commander';
import 'source-map-support/register';

import { bump } from './commands/bump';

const { version } = require('../package.json');

program.name('helm-tools').description('CLI tool to interact with Helm Charts').version(version);

program.command('bump')
  .argument('chart', 'Location of the Helm Chart')
  .action(bump);

program.parse();
