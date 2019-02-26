const { expect } = require('chai')

const dns = require('../dns')

describe('dns', () => {
  it('should resolve google.com', async () => {
    const result = await dns('google.com');

    expect(result).to.have.lengthOf.above(2);
    expect(
      result.filter(value => value.includes('::'))
    ).to.have.lengthOf.above(0);
  });
})
