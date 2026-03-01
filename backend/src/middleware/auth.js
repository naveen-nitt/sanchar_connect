const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Store = require('../models/Store');

const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const store = await Store.findById(decoded.id).select('-password');
    if (!store) return res.status(401).json({ message: 'Invalid session' });
    req.user = store;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authRequired };
