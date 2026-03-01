const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const env = require('../config/env');

const generateStoreQr = async (storeId) => {
  const dir = path.resolve(env.uploadDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const content = `${env.frontendUrl}/customer/${storeId}`;
  const filePath = path.join(dir, `${storeId}.png`);
  await QRCode.toFile(filePath, content, { margin: 1, width: 300 });
  return `/qr/${storeId}.png`;
};

module.exports = { generateStoreQr };
