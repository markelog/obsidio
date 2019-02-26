const dns = require('dns');

/**
 * Get both ipv6 and ipv4 addresses
 * @param {string} address
 * @return {promise.<array>}
 */
module.exports = (address) => {
  return new Promise((resolve, reject) => {
    dns.resolve4(address, (err, addresses) => {
      if (err !== null) {
        reject(err);
        return;
      }

      resolve(addresses);
    });
  });
};
