const mongoose = require('mongoose');

const messageLogSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    mobile_number: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['sent', 'failed', 'delivered'], default: 'sent' },
    provider_response: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MessageLog', messageLogSchema);
