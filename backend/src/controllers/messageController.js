const Customer = require('../models/Customer');
const MessageTemplate = require('../models/MessageTemplate');
const MessageLog = require('../models/MessageLog');
const Store = require('../models/Store');
const { sendWhatsAppText, interpolate } = require('../services/whatsappService');

const saveTemplate = async (req, res) => {
  const payload = { ...req.body, store_id: req.user.store_id };
  const template = await MessageTemplate.create(payload);
  res.status(201).json({ template });
};

const listTemplates = async (req, res) => {
  const templates = await MessageTemplate.listByStore(req.user.store_id);
  res.json({ templates });
};

const sendBulk = async (req, res) => {
  const { customerIds = [], message, variables = {} } = req.body;
  const store = await Store.findByStoreId(req.user.store_id);
  const allCustomers = await Customer.listByStore(req.user.store_id);
  const wanted = new Set(customerIds.map((x) => Number(x)));
  const customers = allCustomers.filter((c) => wanted.has(Number(c.id)));

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
        customer_id: customer.id,
        mobile_number: customer.mobile_number,
        message: rendered,
        status: 'sent',
        provider_response: response
      });
      results.push({ customer: customer.mobile_number, status: 'sent' });
    } catch (error) {
      await MessageLog.create({
        store_id: req.user.store_id,
        customer_id: customer.id,
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
