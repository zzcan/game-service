const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
client.getAsync = promisify(client.get);
client.setAsync = promisify(client.set);

module.exports = client;