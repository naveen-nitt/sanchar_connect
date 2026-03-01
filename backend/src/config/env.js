const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sanchar_connect',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
  storagePath: process.env.QR_STORAGE_PATH || 'uploads/qrcodes',
  whatsappApiVersion: process.env.WHATSAPP_API_VERSION || 'v20.0'
};
