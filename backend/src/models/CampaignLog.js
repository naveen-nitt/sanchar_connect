const mongoose = require('mongoose');

const campaignLogSchema = new mongoose.Schema(
  {
    store_id: { type: String, index: true, required: true },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    mobile_number: String,
    message: String,
    status: { type: String, enum: ['sent', 'failed', 'delivered'], default: 'sent' },
    error: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('CampaignLog', campaignLogSchema);
