const { expect } = require('chai');

const scan = require('./scan');
const dns = require('../../dns');

describe('scan', () => {
  it('should scan google.com', async function () {
    this.timeout(5000);
    const ips = await dns('google.com');

    const result = await scan(ips, '80-81');

    expect(result).to.have.length.above(0);

    expect(result[0]).to.have.property('ip');
    expect(result[0]).to.have.property('port');
    expect(result[0]).to.have.property('status');
    expect(result[0].ip).to.have.length.above(3);
    expect(result[0].ip.split('.')).to.have.length.above(3);
    expect(result[0].port).to.have.equal(80);
    expect(result[0].status).to.have.equal('open');
  });
});

