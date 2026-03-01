const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Store = require('../models/Store');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await Store.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });
    req.user = Store.sanitizeStore(user);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

const permit = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};

module.exports = { protect, permit };
