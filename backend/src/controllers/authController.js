const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Store = require('../models/Store');

const signToken = (store) =>
  jwt.sign({ id: store._id, role: store.role, store_id: store.store_id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const login = async (req, res) => {
  const { email, password } = req.body;
  const store = await Store.findOne({ email });
  if (!store || !(await store.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({
    token: signToken(store),
    user: {
      store_id: store.store_id,
      store_name: store.store_name,
      owner_name: store.owner_name,
      email: store.email,
      role: store.role,
      qr_code_url: store.qr_code_url
    }
  });
};

const me = async (req, res) => res.json({ user: req.user });

module.exports = { login, me };
