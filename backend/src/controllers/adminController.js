const Store = require('../models/Store');
const Customer = require('../models/Customer');
const { generateStoreId } = require('../utils/storeId');
const { generateStoreQr } = require('../services/qrService');

const createStore = async (req, res) => {
  const store_id = generateStoreId();
  const created = await Store.create({ ...req.body, store_id, role: 'owner' });
  const qr_code_url = await generateStoreQr(store_id);
  const store = await Store.updateQr(created.id, qr_code_url);
  return res.status(201).json({ store: Store.sanitizeStore(store) });
};

const platformStats = async (req, res) => {
  const [totalStores, totalCustomers] = await Promise.all([Store.countOwners(), Customer.countAll()]);
  res.json({ totalStores, totalCustomers });
};

module.exports = { createStore, platformStats };
