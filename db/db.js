const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
client.getAsync = promisify(client.get);

module.exports = client;