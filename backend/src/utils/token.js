const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (payload) => jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiry });

module.exports = { signToken };
