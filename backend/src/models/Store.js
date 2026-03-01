const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const storeSchema = new mongoose.Schema(
  {
    store_id: { type: String, unique: true, index: true, required: true },
    store_name: { type: String, required: true },
    owner_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'owner'], default: 'owner' },
    whatsapp_access_token: { type: String },
    whatsapp_phone_number_id: { type: String },
    qr_code_url: { type: String },
    metadata: {
      billing_plan: { type: String, default: 'starter' },
      razorpay_customer_id: String,
      sms_fallback_enabled: { type: Boolean, default: false }
    }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

storeSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

storeSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Store', storeSchema);
