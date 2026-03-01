const rateLimit = require('express-rate-limit');

const customerFormLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many submissions. Please try again shortly.' }
});

module.exports = { customerFormLimiter };
