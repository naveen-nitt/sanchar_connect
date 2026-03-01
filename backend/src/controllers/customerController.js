const Customer = require('../models/Customer');
const { buildCustomerFilter } = require('../utils/filters');
const { toCsvBuffer, toXlsxBuffer } = require('../utils/export');

const normalizePhone = (mobile) => String(mobile || '').replace(/\D/g, '');
const calcAge = (dob) => {
  if (!dob) return undefined;
  const diff = Date.now() - new Date(dob).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

const registerCustomer = async (req, res) => {
  const { store_id, name, mobile_number, date_of_birth, source = 'QR' } = req.body;
  const phone = normalizePhone(mobile_number);
  if (!store_id || !name || !phone || !date_of_birth) {
    return res.status(400).json({ message: 'store_id, name, mobile_number, date_of_birth required' });
  }
  if (!/^\d{10,15}$/.test(phone)) {
    return res.status(400).json({ message: 'Invalid mobile number' });
  }

  const age = calcAge(date_of_birth);
  const now = new Date();
  const existing = await Customer.findOne({ store_id, mobile_number: phone });

  if (existing) {
    existing.name = name;
    existing.age = age;
    existing.date_of_birth = date_of_birth;
    existing.modified_datetime = now;
    existing.visit_count += 1;
    existing.source = source;
    await existing.save();
    return res.json({ message: 'Customer updated', customer: existing, isNew: false });
  }

  const customer = await Customer.create({
    store_id,
    name,
    mobile_number: phone,
    date_of_birth,
    age,
    source,
    first_visit_datetime: now,
    modified_datetime: now
  });
  return res.status(201).json({ message: 'Customer registered', customer, isNew: true });
};

const getCustomers = async (req, res) => {
  const filter = buildCustomerFilter({ ...req.query, storeId: req.params.storeId });
  const customers = await Customer.find(filter).sort({ modified_datetime: -1 }).limit(1000);
  res.json({ count: customers.length, customers });
};

const exportCustomers = async (req, res) => {
  const filter = buildCustomerFilter({ ...req.query, storeId: req.params.storeId });
  const customers = await Customer.find(filter).sort({ modified_datetime: -1 });
  const format = req.query.format || 'csv';

  if (format === 'xlsx') {
    const file = toXlsxBuffer(customers);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="customers.xlsx"');
    return res.send(file);
  }

  const file = toCsvBuffer(customers);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="customers.csv"');
  return res.send(file);
};

module.exports = { registerCustomer, getCustomers, exportCustomers };
