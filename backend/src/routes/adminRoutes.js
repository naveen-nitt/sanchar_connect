const express = require('express');
const { createStore, platformStats } = require('../controllers/adminController');
const { protect, permit } = require('../middleware/auth');

const router = express.Router();

router.post('/stores', protect, permit('admin'), createStore);
router.get('/stats', protect, permit('admin'), platformStats);

module.exports = router;
