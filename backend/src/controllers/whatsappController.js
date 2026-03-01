const Customer = require('../models/Customer');
const MessageTemplate = require('../models/MessageTemplate');
const CampaignLog = require('../models/CampaignLog');
const { buildCustomerFilter } = require('../utils/filters');
const { sendWhatsAppMessage, applyVariables } = require('../services/whatsappService');

const createTemplate = async (req, res) => {
  const { name, body, is_draft = true } = req.body;
  const template = await MessageTemplate.create({ store_id: req.user.store_id, name, body, is_draft });
  res.status(201).json(template);
};

const previewTemplate = async (req, res) => {
  const { body, variables } = req.body;
  res.json({ preview: applyVariables(body, variables) });
};

const sendIndividual = async (req, res) => {
  const { mobile_number, message, variables = {} } = req.body;
  const finalMessage = applyVariables(message, variables);
  try {
    await sendWhatsAppMessage({
      accessToken: req.user.whatsapp_access_token,
      phoneNumberId: req.user.whatsapp_phone_number_id,
      to: mobile_number,
      body: finalMessage
    });
    const log = await CampaignLog.create({ store_id: req.user.store_id, mobile_number, message: finalMessage, status: 'sent' });
    res.json({ message: 'Sent', log });
  } catch (error) {
    await CampaignLog.create({ store_id: req.user.store_id, mobile_number, message: finalMessage, status: 'failed', error: error.message });
    res.status(500).json({ message: 'Failed to send', error: error.response?.data || error.message });
  }
};

const sendBulk = async (req, res) => {
  const { message, variables = {}, filters = {} } = req.body;
  const filter = buildCustomerFilter({ ...filters, storeId: req.user.store_id });
  const customers = await Customer.find(filter).limit(500);

  const results = { sent: 0, failed: 0, total: customers.length };
  await Promise.all(customers.map(async (customer) => {
    const finalMessage = applyVariables(message, {
      name: customer.name,
      discount: variables.discount,
      expiry_date: variables.expiry_date
    });

    try {
      await sendWhatsAppMessage({
        accessToken: req.user.whatsapp_access_token,
        phoneNumberId: req.user.whatsapp_phone_number_id,
        to: customer.mobile_number,
        body: finalMessage
      });
      results.sent += 1;
      await CampaignLog.create({ store_id: req.user.store_id, customer_id: customer._id, mobile_number: customer.mobile_number, message: finalMessage, status: 'sent' });
    } catch (error) {
      results.failed += 1;
      await CampaignLog.create({ store_id: req.user.store_id, customer_id: customer._id, mobile_number: customer.mobile_number, message: finalMessage, status: 'failed', error: error.message });
    }
  }));

  res.json(results);
};

module.exports = { createTemplate, previewTemplate, sendIndividual, sendBulk };
