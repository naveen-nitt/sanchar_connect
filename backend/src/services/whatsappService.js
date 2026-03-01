const axios = require('axios');
const env = require('../config/env');

const sendWhatsAppMessage = async ({ accessToken, phoneNumberId, to, body }) => {
  const url = `https://graph.facebook.com/${env.whatsappApiVersion}/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body }
  };
  return axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
};

const applyVariables = (template, variables = {}) =>
  template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => variables[key] || '');

module.exports = { sendWhatsAppMessage, applyVariables };
