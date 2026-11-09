const path = require('path');

process.env.NODE_ENV = 'test';
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.test'),
  override: true,
  quiet: true,
});

// Safety net: refuse to run against anything that isn't a test database
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.includes('test')) {
  throw new Error(`Refusing to run tests against: ${process.env.DATABASE_URL}`);
}
