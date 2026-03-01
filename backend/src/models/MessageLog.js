const { getPool } = require('../config/db');

const create = async (payload) => {
  const db = getPool();
  await db.query(
    'INSERT INTO message_logs (store_id, customer_id, mobile_number, message, status, provider_response) VALUES (?, ?, ?, ?, ?, ?)',
    [payload.store_id, payload.customer_id || null, payload.mobile_number, payload.message, payload.status || 'sent', JSON.stringify(payload.provider_response || {})]
  );
};

module.exports = { create };
