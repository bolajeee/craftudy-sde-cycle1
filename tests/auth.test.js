const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const pool = require('../src/db');
const { resetDb } = require('./helpers/db');

const validSignup = {
  name: 'Bolaji',
  email: 'bolaji@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

const credentials = {
  email: validSignup.email,
  password: validSignup.password,
};

function signup(body = validSignup) {
  return request(app).post('/auth/signup').send(body);
}

function login(body = credentials) {
  return request(app).post('/auth/login').send(body);
}

beforeEach(resetDb);

describe('POST /auth/signup', () => {
  test('creates a user and returns only safe fields', async () => {
    const res = await signup();

    expect(res.status).toBe(201);
    // pg returns BIGINT columns as strings, so the id is a string here
    expect(res.body.user).toEqual({
      id: expect.any(String),
      name: 'Bolaji',
      email: 'bolaji@example.com',
    });
  });

  test('stores a bcrypt hash, never the plain password', async () => {
    await signup();

    const { rows } = await pool.query(
      'SELECT password_hash FROM users WHERE email = $1',
      [validSignup.email],
    );

    expect(rows[0].password_hash).not.toBe(validSignup.password);
    expect(rows[0].password_hash).toMatch(/^\$2[aby]\$12\$/);
  });

  test('rejects a duplicate email with 409', async () => {
    await signup();
    const res = await signup();

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ error: 'Email already in use' });
  });

  test.each([
    ['mismatched passwords', { confirmPassword: 'different123' }],
    [
      'a password under 8 characters',
      { password: 'short', confirmPassword: 'short' },
    ],
    ['an invalid email', { email: 'not-an-email' }],
    ['a name under 3 characters', { name: 'Bo' }],
  ])('rejects %s with 400', async (_label, override) => {
    const res = await signup({ ...validSignup, ...override });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid signup info' });
  });

  test('rejects malformed JSON with 400', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .set('Content-Type', 'application/json')
      .send('{"name": "Bolaji",');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Malformed JSON request body' });
  });
});

// The login limiter allows 5 attempts per IP per 15 minutes, and every
// request below counts, including the 400s (the limiter runs before
// validation). Jest gives each test file a fresh limiter, but this file
// sits at exactly 5 login calls. A 6th will get 429, not the status you expect.
describe('POST /auth/login', () => {
  beforeEach(() => signup());

  test('returns a token that identifies the user', async () => {
    const res = await login();

    expect(res.status).toBe(200);
    expect(res.body.user).toEqual({
      id: expect.any(String),
      name: 'Bolaji',
      email: 'bolaji@example.com',
    });

    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(String(decoded.userId)).toBe(res.body.user.id);
  });

  test('rejects a wrong password with 401', async () => {
    const res = await login({ ...credentials, password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid email or password');
    expect(res.body).not.toHaveProperty('token');
  });

  test('gives an unknown email the same response as a wrong password', async () => {
    const wrongPassword = await login({
      ...credentials,
      password: 'wrong-password',
    });
    const unknownEmail = await login({
      ...credentials,
      email: 'nobody@example.com',
    });

    // Identical responses mean the API never confirms which emails exist
    expect(unknownEmail.status).toBe(wrongPassword.status);
    expect(unknownEmail.body).toEqual(wrongPassword.body);
  });

  test('rejects a user with no stored password hash with 401', async () => {
    // Rows created before migration 003 have a NULL password_hash
    await pool.query(
      "INSERT INTO users (name, email) VALUES ('Legacy', 'legacy@example.com')",
    );

    const res = await login({
      email: 'legacy@example.com',
      password: 'anything123',
    });

    expect(res.status).toBe(401);
  });
});
