const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    content: { type: String, required: true },
    is_draft: { type: Boolean, default: true },
    variables: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MessageTemplate', messageTemplateSchema);
