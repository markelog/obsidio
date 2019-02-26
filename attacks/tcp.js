/**
 * Sending a TCP SYN packet properly using the raw-socket package.
 */
const crypto = require('crypto');

const raw = require('raw-socket');

const fakeIP = require('./fake-ip');
const getRandom = require('./get-random');

module.exports = (ip, port, fn) => {
  // create a raw socket using TCP
  const socket = raw.createSocket({
    protocol: raw.Protocol.TCP
  });

  // generate the packet.

  const packet = makeSyn(ip, port)

  // send packet with offset 0, length = packet.length, to the dstIP
  // The port data is in the packet already, so we don't worry about that during sending.
  // Open tcpdump or wireshark and watch the not quite three way handshake. Useful to test for open ports.
  socket.send(packet, 0, packet.length, ip, () => {});
}

/**
 * generate pseudo-header. Used to calculate package checksum.
 * @param {number} source - source ip
 * @param {number} destination - destination ip
 * @param {number} packetLength - tcp packet length
 * @return {Buffer} the pseudo-header, used later
 */
const getHeader = (source, destination, packetLength) => {
  // new buffer of length 12. The pseudo-header length
  var header = new Buffer(12);
  // Important to fill with zeroes. Node.js does not zero the memory before creating the buffer.
  header.fill(0);
  header.writeUInt32BE(source, 0); // write source ip, a 32 bit integer
  header.writeUInt32BE(destination, 4); // write destination ip, a 32 bit integer
  header.writeUInt8(6, 9); // specifies protocol. Here we write 6 for TCP. Other protocols have other numbers.
  // Write the TCP packet length of which we are generating a pseudo-header for.
  // Does not include the length of the psuedo-header.
  header.writeUInt16BE(packetLength, 10);
  return header;
};

/**
 * Generate SYN packet
 * @param {number} ip - ip as an integer
 * @param {number} port - destination port
 * @return {Buffer} the TCP SYN packet
 */
const makeSyn = (ip, port) => {
  // A scaffolding TCP syn packet. Notice all zeroes except a few options.
  // The "few options" include setting the SYN flags.
  // Don't change it if you don't know what you're doing.
  const packet = new Buffer('0000000000000000000000005002200000000000', 'hex');

  // Need 4 random bytes as sequence. Needs to be random to avoid collision.
  // You can choose your own random source. I chose the crypto module.
  crypto.randomBytes(4).copy(packet, 4);

  packet.writeUInt16BE(getRandom(1024, 65535), 0); // Write source port
  packet.writeUInt16BE(port, 2); // Write destination port

  // generate checksum with utility function
  // using a pseudo header and the tcp packet scaffold
  const sum = raw.createChecksum(
    getHeader(fakeIP(), ip, packet.length),
    packet
  );

  // writing the checksum back to the packet. Packet complete!
  packet.writeUInt16BE(sum, 16);

  return packet;
};
