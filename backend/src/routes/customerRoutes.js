const express = require('express');
const { registerCustomer, listCustomers } = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const enforceStoreScope = require('../middleware/storeIsolation');
const { customerFormLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.post('/register', customerFormLimiter, registerCustomer);
router.get('/', protect, enforceStoreScope, listCustomers);

module.exports = router;
