const crypto = require('crypto');

const generateStoreId = () => `ST${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

module.exports = { generateStoreId };
