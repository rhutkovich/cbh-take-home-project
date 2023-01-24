const { deterministicPartitionKey } = require("./dpk");
const crypto = require('crypto');

describe("deterministicPartitionKey", () => {
  it("Should return the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe('0');
  });

  it("Should return partition key provided by the incoming event", () => {
    const expectedKey = 'fancyPartitionKey';
    const event = {otherData: 42, partitionKey: expectedKey};

    const actualKey = deterministicPartitionKey(event);
    expect(actualKey).toBe(expectedKey);
    expect(actualKey.length).toBeLessThanOrEqual(256);
  });

  it("Should return key as calculated hash of income event if the event does not contain a partition key", () => {
    const event = {otherData: 43};
    const expectedKey = getHash(JSON.stringify(event))

    const actualKey = deterministicPartitionKey(event);
    expect(actualKey).toBe(expectedKey);
    expect(actualKey.length).toBeLessThanOrEqual(256);
  });

  it("Should return string key if the partition key of an incoming event is not a string", () => {
    const partitionKey = 789;
    const event = {otherData: 44, partitionKey};
    const expectedKey = JSON.stringify(partitionKey);

    const actualKey = deterministicPartitionKey(event);
    expect(actualKey).toBe(expectedKey);
    expect(actualKey.length).toBeLessThanOrEqual(256);
  });

  it("Should return key as a hash of provided partition key in event if the length of provided key exceeds 256", () => {
    const partitionKey = 'X'.repeat(257);
    const event = {otherData: 45, partitionKey};
    const expectedKey = getHash(partitionKey);

    const actualKey = deterministicPartitionKey(event);
    expect(actualKey).toBe(expectedKey);
    expect(actualKey.length).toBeLessThanOrEqual(256);
  });

  it("Should return key as a hash of stringify-ed partition key from incoming event if the length of it exceeds 256", () => {
    const partitionKey = new Array(300).fill({}, 0, 300);
    const event = {otherData: 45, partitionKey};
    const expectedKey = getHash(JSON.stringify(partitionKey));

    const actualKey = deterministicPartitionKey(event);
    expect(actualKey).toBe(expectedKey);
    expect(actualKey.length).toBeLessThanOrEqual(256);
  });
});

function getHash(data) {
  return crypto.createHash('sha3-512').update(data).digest('hex');
}
