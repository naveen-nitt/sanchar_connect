const crypto = require('crypto');

const generateStoreId = (storeName = 'store') => {
  const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 15);
  const random = crypto.randomBytes(3).toString('hex');
  return `${slug || 'store'}-${random}`;
};

module.exports = { generateStoreId };
