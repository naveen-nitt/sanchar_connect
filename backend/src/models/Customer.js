const { getPool } = require('../config/db');

const normalize = (row) => ({
  ...row,
  tags: row.tags ? JSON.parse(row.tags) : []
});

const create = async (payload) => {
  const db = getPool();
  const [result] = await db.query(
    `INSERT INTO customers
    (mobile_number, store_id, name, age, date_of_birth, visit_count, first_visit_datetime, modified_datetime, source, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.mobile_number,
      payload.store_id,
      payload.name,
      payload.age,
      payload.date_of_birth,
      payload.visit_count || 1,
      payload.first_visit_datetime || new Date(),
      payload.modified_datetime || new Date(),
      payload.source || 'QR',
      JSON.stringify(payload.tags || [])
    ]
  );
  return findById(result.insertId);
};

const findByStoreAndMobile = async (storeId, mobile) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM customers WHERE store_id = ? AND mobile_number = ? LIMIT 1', [storeId, mobile]);
  return rows[0] ? normalize(rows[0]) : null;
};

const updateVisit = async (id, payload) => {
  const db = getPool();
  await db.query(
    `UPDATE customers SET name=?, date_of_birth=?, age=?, modified_datetime=?, visit_count = visit_count + 1, source=? WHERE id=?`,
    [payload.name, payload.date_of_birth, payload.age, new Date(), payload.source || 'QR', id]
  );
  return findById(id);
};

const findById = async (id) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM customers WHERE id=? LIMIT 1', [id]);
  return rows[0] ? normalize(rows[0]) : null;
};

const countByStore = async (storeId) => {
  const db = getPool();
  const [rows] = await db.query('SELECT COUNT(*) as total FROM customers WHERE store_id=?', [storeId]);
  return rows[0].total;
};

const countAll = async () => {
  const db = getPool();
  const [rows] = await db.query('SELECT COUNT(*) as total FROM customers');
  return rows[0].total;
};

const sumVisitsByStore = async (storeId) => {
  const db = getPool();
  const [rows] = await db.query('SELECT COALESCE(SUM(visit_count),0) as total FROM customers WHERE store_id=?', [storeId]);
  return rows[0].total;
};

const countSince = async (storeId, date) => {
  const db = getPool();
  const [rows] = await db.query('SELECT COUNT(*) as total FROM customers WHERE store_id=? AND modified_datetime >= ?', [storeId, date]);
  return rows[0].total;
};

const listByStore = async (storeId) => {
  const db = getPool();
  const [rows] = await db.query('SELECT * FROM customers WHERE store_id=? ORDER BY modified_datetime DESC', [storeId]);
  return rows.map(normalize);
};

const listFiltered = async (storeId, filters) => {
  const db = getPool();
  const where = ['store_id = ?'];
  const params = [storeId];

  if (filters.minAge) { where.push('age >= ?'); params.push(Number(filters.minAge)); }
  if (filters.maxAge) { where.push('age <= ?'); params.push(Number(filters.maxAge)); }
  if (filters.birthdayMonth) { where.push('MONTH(date_of_birth) = ?'); params.push(Number(filters.birthdayMonth)); }
  if (filters.minVisits) { where.push('visit_count >= ?'); params.push(Number(filters.minVisits)); }
  if (filters.lastVisitFrom) { where.push('modified_datetime >= ?'); params.push(filters.lastVisitFrom); }
  if (filters.tags) {
    for (const tag of filters.tags.split(',')) {
      where.push('JSON_CONTAINS(tags, JSON_QUOTE(?))');
      params.push(tag.trim());
    }
  }
  if (filters.search) { where.push('(name LIKE ? OR mobile_number LIKE ?)'); params.push(`%${filters.search}%`, `%${filters.search}%`); }

  const [rows] = await db.query(`SELECT * FROM customers WHERE ${where.join(' AND ')} ORDER BY modified_datetime DESC LIMIT 5000`, params);
  return rows.map(normalize);
};

module.exports = {
  create,
  findByStoreAndMobile,
  updateVisit,
  findById,
  countByStore,
  countAll,
  sumVisitsByStore,
  countSince,
  listByStore,
  listFiltered
};
