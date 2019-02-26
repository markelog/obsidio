const { isIPv4 } = require('net');
const Evilscan = require('evilscan');

/**
 * Scan for open ports
 * @param {string} ip
 * @param {string} ports
 */
function scanner(ip, ports) {

  // Evilscan has option like "ip" and
  // can accept DNS address as target, but they both buggy :/
  const options = {
    target: ip,
    port: ports,
    status: 'O', // Open
    banner: false
  };
  return new Promise((resolve, reject) => {
    new Evilscan(options, (createError, scan) => {
      if (createError !== null) {
        reject(createError);
        return;
      }

      const result = [];

      scan.on('result', (data) => {
        result.push(data);
      });

      scan.on('error', (error) => {
        reject(error);
      });

      scan.on('done', () => {
        resolve(result);
      });

      scan.run();
    });
  });
}

/**
 * @param {array[string]} ips
 * @param {string} [ports=0-65535]
 */
module.exports = async (ips, ports = '0-65535') => {

  // TODO: Add support for IPv6
  const promises = ips.filter(isIPv4).map(ip => scanner(ip, ports));

  const results = await Promise.all(promises);

  return results.reduce((acc, result) => {
    return acc.concat(result);
  }, []);
};
