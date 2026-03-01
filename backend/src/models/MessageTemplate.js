const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    body: { type: String, required: true },
    is_draft: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MessageTemplate', messageTemplateSchema);
