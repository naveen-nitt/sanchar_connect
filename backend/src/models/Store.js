const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const storeSchema = new mongoose.Schema(
  {
    store_id: { type: String, required: true, unique: true, index: true },
    store_name: { type: String, required: true, trim: true },
    owner_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['admin', 'owner'], default: 'owner' },
    whatsapp_access_token: { type: String, default: '' },
    whatsapp_phone_number_id: { type: String, default: '' },
    subscription_tier: { type: String, default: 'starter' },
    sms_fallback_enabled: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

storeSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

storeSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Store', storeSchema);
