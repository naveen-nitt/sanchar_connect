const { getPool } = require('../config/db');

const create = async (payload) => {
  const db = getPool();
  const [result] = await db.query(
    'INSERT INTO message_templates (store_id, name, content, is_draft, variables) VALUES (?, ?, ?, ?, ?)',
    [payload.store_id, payload.name, payload.content, payload.is_draft ?? true, JSON.stringify(payload.variables || [])]
  );
  const [rows] = await db.query('SELECT * FROM message_templates WHERE id = ?', [result.insertId]);
  return rows[0];
};

const listByStore = async (storeId) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM message_templates WHERE store_id=? ORDER BY updated_at DESC', [storeId]);
  return rows;
};

module.exports = { create, listByStore };
