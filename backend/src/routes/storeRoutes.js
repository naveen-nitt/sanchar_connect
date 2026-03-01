const express = require('express');
const { authRequired } = require('../middleware/auth');
const { ensureStoreScope } = require('../middleware/storeScope');
const { getDashboard } = require('../controllers/storeController');
const { getCustomers, exportCustomers } = require('../controllers/customerController');
const { createTemplate, previewTemplate, sendBulk, sendIndividual } = require('../controllers/whatsappController');

const router = express.Router();
router.use(authRequired);

router.get('/:storeId/dashboard', ensureStoreScope, getDashboard);
router.get('/:storeId/customers', ensureStoreScope, getCustomers);
router.get('/:storeId/customers/export', ensureStoreScope, exportCustomers);
router.post('/:storeId/templates', ensureStoreScope, createTemplate);
router.post('/:storeId/templates/preview', ensureStoreScope, previewTemplate);
router.post('/:storeId/whatsapp/bulk', ensureStoreScope, sendBulk);
router.post('/:storeId/whatsapp/individual', ensureStoreScope, sendIndividual);

module.exports = router;
