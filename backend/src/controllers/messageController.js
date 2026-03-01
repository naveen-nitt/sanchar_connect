const Customer = require('../models/Customer');
const MessageTemplate = require('../models/MessageTemplate');
const MessageLog = require('../models/MessageLog');
const Store = require('../models/Store');
const { sendWhatsAppText, interpolate } = require('../services/whatsappService');

const saveTemplate = async (req, res) => {
  const payload = { ...req.body, store_id: req.user.store_id };
  const tpl = await MessageTemplate.create(payload);
  res.status(201).json({ template: tpl });
};

const listTemplates = async (req, res) => {
  const templates = await MessageTemplate.find({ store_id: req.user.store_id }).sort({ updatedAt: -1 });
  res.json({ templates });
};

const sendBulk = async (req, res) => {
  const { customerIds = [], message, variables = {} } = req.body;
  const store = await Store.findOne({ store_id: req.user.store_id });
  const customers = await Customer.find({ _id: { $in: customerIds }, store_id: req.user.store_id });

  const results = [];
  for (const customer of customers) {
    const rendered = interpolate(message, { name: customer.name, ...variables });
    try {
      const response = await sendWhatsAppText({
        token: store.whatsapp_access_token,
        phoneNumberId: store.whatsapp_phone_number_id,
        to: customer.mobile_number,
        message: rendered
      });
      await MessageLog.create({
        store_id: req.user.store_id,
        customer_id: customer._id,
        mobile_number: customer.mobile_number,
        message: rendered,
        status: 'sent',
        provider_response: response
      });
      results.push({ customer: customer.mobile_number, status: 'sent' });
    } catch (error) {
      await MessageLog.create({
        store_id: req.user.store_id,
        customer_id: customer._id,
        mobile_number: customer.mobile_number,
        message: rendered,
        status: 'failed',
        provider_response: error.response?.data || error.message
      });
      results.push({ customer: customer.mobile_number, status: 'failed' });
    }
  }

  res.json({ results });
};

const sendIndividual = async (req, res) => {
  req.body.customerIds = [req.body.customerId];
  return sendBulk(req, res);
};

module.exports = { saveTemplate, listTemplates, sendBulk, sendIndividual };
