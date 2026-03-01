const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: process.env.DB_PORT || 3306,
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'sanchar_connect',
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:5000',
  uploadDir: process.env.UPLOAD_DIR || 'uploads/qr',
  whatsappApiVersion: process.env.WHATSAPP_API_VERSION || 'v20.0'
};
