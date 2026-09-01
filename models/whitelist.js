require('dotenv').config();

const envWhitelist = process.env.WHITELIST || '';
const whitelist = envWhitelist.split(',');

module.exports = { whitelist };