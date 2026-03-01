const express = require('express');
const { protect, permit } = require('../middleware/auth');
const { saveTemplate, listTemplates, sendBulk, sendIndividual } = require('../controllers/messageController');

const router = express.Router();
router.use(protect, permit('owner', 'admin'));

router.post('/templates', saveTemplate);
router.get('/templates', listTemplates);
router.post('/bulk', sendBulk);
router.post('/single', sendIndividual);

module.exports = router;
