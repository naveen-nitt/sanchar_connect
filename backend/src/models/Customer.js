const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    mobile_number: { type: String, required: true },
    store_id: { type: String, required: true, index: true },
    name: { type: String, required: true },
    age: { type: Number },
    date_of_birth: { type: Date, required: true, index: true },
    visit_count: { type: Number, default: 1 },
    first_visit_datetime: { type: Date, default: Date.now },
    modified_datetime: { type: Date, default: Date.now, index: true },
    last_purchase_datetime: { type: Date, default: null },
    tags: { type: [String], default: [] },
    source: { type: String, default: 'QR' },
    is_active: { type: Boolean, default: true },
    loyalty_points: { type: Number, default: 0 },
    purchase_total: { type: Number, default: 0 }
  },
  { timestamps: true }
);

customerSchema.index({ store_id: 1, mobile_number: 1 }, { unique: true });
customerSchema.index({ age: 1 });

module.exports = mongoose.model('Customer', customerSchema);
