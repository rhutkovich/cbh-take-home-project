const crypto = require('crypto');

const TRIVIAL_PARTITION_KEY = '0';
const MAX_PARTITION_KEY_LENGTH = 256;

function getHash(data) {
  return crypto.createHash('sha3-512').update(data).digest('hex');
}

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (!event.partitionKey) {
    return getHash(JSON.stringify(event));
  }

  let candidate = event.partitionKey;

  if (typeof candidate !== 'string') {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = getHash(candidate);
  }

  return candidate;
};