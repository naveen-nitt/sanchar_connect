const Store = require('../models/Store');

const bootstrapAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await Store.findByEmail(email);
  if (existing) return;

  await Store.create({
    store_id: 'ADMIN',
    store_name: 'Sanchar Platform',
    owner_name: 'Platform Admin',
    email,
    password,
    role: 'admin'
  });
  console.log('Default admin bootstrapped');
};

module.exports = bootstrapAdmin;
