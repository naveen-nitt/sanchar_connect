const path = require('path');
const Store = require('../models/Store');
const Customer = require('../models/Customer');
const { generateStoreId } = require('../utils/store');
const { generateStoreQr } = require('../services/qrService');

const createStore = async (req, res) => {
  const { store_name, owner_name, email, password } = req.body;
  if (!store_name || !owner_name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const store_id = generateStoreId(store_name);
  const store = await Store.create({ store_id, store_name, owner_name, email, password, role: 'owner' });
  const qr = await generateStoreQr(store_id);
  res.status(201).json({ store, qr_url: `/static/qrcodes/${path.basename(qr.filePath)}`, customer_url: qr.contentUrl });
};

const adminStats = async (req, res) => {
  const [totalStores, totalCustomers] = await Promise.all([Store.countDocuments(), Customer.countDocuments()]);
  res.json({ totalStores, totalCustomers });
};

module.exports = { createStore, adminStats };
