const Store = require('../models/Store');
const Customer = require('../models/Customer');
const { generateStoreId } = require('../utils/storeId');
const { generateStoreQr } = require('../services/qrService');

const createStore = async (req, res) => {
  const store_id = generateStoreId();
  const newStore = await Store.create({ ...req.body, store_id, role: 'owner' });
  newStore.qr_code_url = await generateStoreQr(store_id);
  await newStore.save();
  return res.status(201).json({ store: newStore });
};

const platformStats = async (req, res) => {
  const [totalStores, totalCustomers] = await Promise.all([
    Store.countDocuments({ role: 'owner' }),
    Customer.countDocuments({})
  ]);
  res.json({ totalStores, totalCustomers });
};

module.exports = { createStore, platformStats };
