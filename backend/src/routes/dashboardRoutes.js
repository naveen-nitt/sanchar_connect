const express = require('express');
const { dashboardStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const enforceStoreScope = require('../middleware/storeIsolation');

const router = express.Router();

router.get('/:storeId', protect, enforceStoreScope, dashboardStats);

module.exports = router;
