const express = require('express');
const { authRequired } = require('../middleware/auth');
const { allowRoles } = require('../middleware/roles');
const { createStore, adminStats } = require('../controllers/adminController');

const router = express.Router();
router.use(authRequired, allowRoles('admin'));

router.post('/stores', createStore);
router.get('/stats', adminStats);

module.exports = router;
