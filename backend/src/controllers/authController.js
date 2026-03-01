const Store = require('../models/Store');
const { signToken } = require('../utils/token');

const login = async (req, res) => {
  const { email, password } = req.body;
  const store = await Store.findOne({ email });
  if (!store) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await store.comparePassword(password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: store._id, role: store.role, store_id: store.store_id });
  res.json({ token, user: { id: store._id, store_id: store.store_id, role: store.role, store_name: store.store_name } });
};

module.exports = { login };
