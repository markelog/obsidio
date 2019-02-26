
const Evilscan = require('evilscan');

/**
 * @param {string} ip
 * @param {string} ports
 */
function scan(ip, ports) {

  // Evilscan has option like "ip" and
  // can accept DNS address as target, but they both buggy :/
  const options = {
    target: ip,
    port: ports,
    status: 'O', // Open
    banner: false
  };
  return new Promise((resolve, reject) => {
    new Evilscan(options, (err, scan) => {
      const result = [];

      scan.on('result', (data) => {
        result.push(data);
      });

      scan.on('error', (err) => {
        reject(err);
      });

      scan.on('done', () => {
        resolve(result);
      });

      scan.run();
    });
  })
}


/**
 * @param {array[string]} ips
 * @param {string} [ports=0-65535]
 */
module.exports = async (ips, ports = '0-65535') => {
  const promises = ips.filter((ip) => {

    // Add support for IPv6
    return ip.includes('::') === false;
  }).map(ip => scan(ip, ports));

  const results = await Promise.all(promises);

  return results.reduce((acc, result) => {
    return acc.concat(result);
  }, [])
}
