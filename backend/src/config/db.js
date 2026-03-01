const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  await mongoose.connect(env.mongoUri, { autoIndex: true });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};

module.exports = connectDB;
