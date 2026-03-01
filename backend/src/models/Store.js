const bcrypt = require('bcryptjs');
const { getPool } = require('../config/db');

const sanitizeStore = (row) => {
  if (!row) return null;
  const { password, ...safe } = row;
  return safe;
};

const create = async (payload) => {
  const db = getPool();
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(payload.password, salt);
  const [result] = await db.query(
    `INSERT INTO stores
    (store_id, store_name, owner_name, email, password, role, whatsapp_access_token, whatsapp_phone_number_id, qr_code_url, billing_plan, razorpay_customer_id, sms_fallback_enabled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.store_id,
      payload.store_name,
      payload.owner_name,
      payload.email.toLowerCase(),
      hashed,
      payload.role || 'owner',
      payload.whatsapp_access_token || null,
      payload.whatsapp_phone_number_id || null,
      payload.qr_code_url || null,
      payload.metadata?.billing_plan || 'starter',
      payload.metadata?.razorpay_customer_id || null,
      payload.metadata?.sms_fallback_enabled || false
    ]
  );
  return findById(result.insertId);
};

const findByEmail = async (email) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM stores WHERE email = ? LIMIT 1', [email.toLowerCase()]);
  return rows[0] || null;
};

const findById = async (id) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM stores WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

const findByStoreId = async (storeId) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM stores WHERE store_id = ? LIMIT 1', [storeId]);
  return rows[0] || null;
};

const updateQr = async (id, qrCodeUrl) => {
  const db = getPool();
  await db.query('UPDATE stores SET qr_code_url = ? WHERE id = ?', [qrCodeUrl, id]);
  return findById(id);
};

const countOwners = async () => {
  const db = getPool();
  const [rows] = await db.query("SELECT COUNT(*) as total FROM stores WHERE role = 'owner'");
  return rows[0].total;
};

const comparePassword = (store, password) => bcrypt.compare(password, store.password);

module.exports = {
  create,
  findByEmail,
  findById,
  findByStoreId,
  updateQr,
  countOwners,
  comparePassword,
  sanitizeStore
};
