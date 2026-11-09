const jwt = require('jsonwebtoken');
const pool = require('../../src/db');

// Inserts a user straight into the DB and signs a token for them.
// Task tests use this instead of POST /auth/login so they never hit the
// login rate limiter, and so a broken login route can't fail task tests.
async function createUser(name, email) {
  const { rows } = await pool.query(
    'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
    [name, email],
  );

  const id = rows[0].id;
  const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return { id, token, auth: `Bearer ${token}` };
}

module.exports = { createUser };
