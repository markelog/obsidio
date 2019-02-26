const { Resolver } = require('dns').promises;

/**
 * Get both ipv6 and ipv4 addresses
 * @param {string} address
 * @return {array[string]}
 */
module.exports = async (address) => {
  const resolver = new Resolver();
  resolver.setServers(['8.8.8.8'])


  const result = await Promise.all([
    resolver.resolve4(address),

    // In case address doesn't have IPv6 address
    resolver.resolve6(address).catch(() => [])
  ])

  return result[0].concat(result[1])
}
