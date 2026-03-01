const app = require('./app');
const env = require('./config/env');
const connectDb = require('./config/db');

(async () => {
  await connectDb();
  app.listen(env.port, () => {
    console.log(`Backend running on ${env.port}`);
  });
})();
