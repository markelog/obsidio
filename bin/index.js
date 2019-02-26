#!/usr/bin/env node

/**
 * Module dependencies.
 */

const program = require('commander');

const cli = require('../cli')

program
  .version('0.0.1')
  .option('-p, --ports <ports>', 'ports to attack, range, individual - 80,81, 80-443')
  .option('-a, --attacks <attacks>', 'types of attack - tcp, tcp is a default one')
  .parse(process.argv);

cli(program).then(report => {
  console.log(report,2);
}).catch(error => {
  console.error(error.message);
  process.exit(error.exitCode);
})
