const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Store = require('../models/Store');

const signToken = (store) =>
  jwt.sign({ id: store.id, role: store.role, store_id: store.store_id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });

const login = async (req, res) => {
  const { email, password } = req.body;
  const store = await Store.findByEmail(email);
  if (!store || !(await Store.comparePassword(store, password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const user = Store.sanitizeStore(store);
  return res.json({ token: signToken(store), user });
};

const me = async (req, res) => res.json({ user: req.user });

module.exports = { login, me };
