const express = require('express');
const rateLimit = require('express-rate-limit');
const { registerCustomer } = require('../controllers/customerController');

const router = express.Router();

const customerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many submissions, try again in a minute'
});

router.post('/register', customerLimiter, registerCustomer);

module.exports = router;
