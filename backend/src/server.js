const connectDB = require('./config/db');
const env = require('./config/env');
const app = require('./app');
const bootstrapAdmin = require('./utils/bootstrapAdmin');

(async () => {
  await connectDB();
  await bootstrapAdmin();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running on port ${env.port}`);
  });
})();
