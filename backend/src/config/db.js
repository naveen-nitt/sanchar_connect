const mysql = require('mysql2/promise');
const env = require('./env');

let pool;

const createPool = () => {
  pool = mysql.createPool({
    host: env.dbHost,
    port: Number(env.dbPort),
    user: env.dbUser,
    password: env.dbPassword,
    database: env.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });
  return pool;
};

const getPool = () => {
  if (!pool) return createPool();
  return pool;
};

const initSchema = async () => {
  const db = getPool();

  await db.query(`CREATE TABLE IF NOT EXISTS stores (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id VARCHAR(32) UNIQUE NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','owner') DEFAULT 'owner',
    whatsapp_access_token TEXT NULL,
    whatsapp_phone_number_id VARCHAR(128) NULL,
    qr_code_url VARCHAR(255) NULL,
    billing_plan VARCHAR(50) DEFAULT 'starter',
    razorpay_customer_id VARCHAR(100) NULL,
    sms_fallback_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    mobile_number VARCHAR(20) NOT NULL,
    store_id VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT NULL,
    date_of_birth DATE NOT NULL,
    visit_count INT DEFAULT 1,
    first_visit_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_purchase_datetime DATETIME NULL,
    tags JSON NULL,
    source VARCHAR(50) DEFAULT 'QR',
    is_active BOOLEAN DEFAULT TRUE,
    loyalty_points INT DEFAULT 0,
    purchase_total DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_store_mobile (store_id, mobile_number),
    INDEX idx_dob (date_of_birth),
    INDEX idx_age (age),
    INDEX idx_modified_datetime (modified_datetime),
    CONSTRAINT fk_customer_store FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS message_templates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_draft BOOLEAN DEFAULT TRUE,
    variables JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template_store (store_id),
    CONSTRAINT fk_template_store FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE
  )`);

  await db.query(`CREATE TABLE IF NOT EXISTS message_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    store_id VARCHAR(32) NOT NULL,
    customer_id BIGINT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('sent','failed','delivered') DEFAULT 'sent',
    provider_response JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_log_store (store_id),
    CONSTRAINT fk_log_store FOREIGN KEY (store_id) REFERENCES stores(store_id) ON DELETE CASCADE,
    CONSTRAINT fk_log_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
  )`);
};

const connectDB = async () => {
  const db = getPool();
  await db.query('SELECT 1');
  await initSchema();
  console.log('MySQL connected and schema ready');
};

module.exports = { connectDB, getPool };
