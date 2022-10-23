#!/usr/bin/env node
import { program } from 'commander';
import 'source-map-support/register';

const { version } = require('../package.json');

program.name('helm-tools').description('CLI tool to interact with Helm Charts').version(version);

program.parse();

console.log('Hello World');
