const axios = require('axios');
const env = require('../config/env');

const interpolate = (text, vars = {}) =>
  Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value ?? ''),
    text
  );

const sendWhatsAppText = async ({ token, phoneNumberId, to, message }) => {
  const url = `https://graph.facebook.com/${env.whatsappApiVersion}/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  };

  const { data } = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return data;
};

module.exports = { sendWhatsAppText, interpolate };
