const express = require('express');
const { exportCustomers } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');
const enforceStoreScope = require('../middleware/storeIsolation');

const router = express.Router();
router.get('/customers', protect, enforceStoreScope, exportCustomers);

module.exports = router;
