const pool = require('../../src/db');

// Wipe the data and restart IDs so each test starts from the same state.
// CASCADE covers tasks.user_id → users.id; order doesn't matter with it.
async function resetDb() {
  await pool.query('TRUNCATE tasks, users RESTART IDENTITY CASCADE');
}

module.exports = { resetDb };
