const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const env = require('../config/env');

const generateStoreQr = async (storeId) => {
  const dir = path.join(process.cwd(), env.storagePath);
  fs.mkdirSync(dir, { recursive: true });
  const contentUrl = `${env.appBaseUrl}/customer/${storeId}`;
  const filePath = path.join(dir, `${storeId}.png`);
  await QRCode.toFile(filePath, contentUrl, { width: 300, margin: 2 });
  return { filePath, contentUrl };
};

module.exports = { generateStoreQr };
