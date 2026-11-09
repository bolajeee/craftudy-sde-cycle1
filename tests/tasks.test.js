const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const { resetDb } = require('./helpers/db');
const { createUser } = require('./helpers/auth');

let alice;
let bob;

beforeEach(async () => {
  await resetDb();
  alice = await createUser('Alice', 'alice@example.com');
  bob = await createUser('Bob', 'bob@example.com');
});

function createTask(user, body = { title: 'Write tests', completed: false }) {
  return request(app).post('/tasks').set('Authorization', user.auth).send(body);
}

describe('authentication on /tasks', () => {
  test('rejects a request with no token', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Authentication token required' });
  });

  test('rejects a header that is not a Bearer token', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', alice.token); // missing "Bearer "

    expect(res.status).toBe(401);
  });

  test('rejects a token signed with the wrong secret', async () => {
    const forged = jwt.sign({ userId: alice.id }, 'not-the-real-secret');

    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${forged}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid or expired token' });
  });

  test('rejects an expired token', async () => {
    const expired = jwt.sign(
      { userId: alice.id, exp: Math.floor(Date.now() / 1000) - 60 },
      process.env.JWT_SECRET,
    );

    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${expired}`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid or expired token' });
  });
});

describe('POST /tasks', () => {
  test('creates a task for the signed-in user', async () => {
    const res = await createTask(alice);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(Number),
      title: 'Write tests',
      completed: false,
    });
  });

  test.each([
    ['a missing title', { completed: false }],
    ['an empty title', { title: '', completed: false }],
    ['a missing completed flag', { title: 'Write tests' }],
    ['a non-boolean completed flag', { title: 'Write tests', completed: 'yes' }],
  ])('rejects %s with 400', async (_label, body) => {
    const res = await createTask(alice, body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid task');
  });
});

describe('GET /tasks', () => {
  test("lists only the signed-in user's tasks", async () => {
    const mine = await createTask(alice, { title: 'Alice task', completed: false });
    await createTask(bob, { title: 'Bob task', completed: true });

    const res = await request(app).get('/tasks').set('Authorization', alice.auth);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mine.body]);
  });

  test('returns an empty array when the user has no tasks', async () => {
    const res = await request(app).get('/tasks').set('Authorization', alice.auth);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('GET /tasks/:id', () => {
  test('returns the task', async () => {
    const created = await createTask(alice);

    const res = await request(app)
      .get(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  test('returns 404 for a task that does not exist', async () => {
    const res = await request(app).get('/tasks/999999').set('Authorization', alice.auth);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Task not found' });
  });

  test.each(['abc', '0', '-1', '1.5'])('rejects id "%s" with 400', async (id) => {
    const res = await request(app).get(`/tasks/${id}`).set('Authorization', alice.auth);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid task ID' });
  });
});

describe('PATCH /tasks/:id', () => {
  test('updates only the fields sent', async () => {
    const created = await createTask(alice);

    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ...created.body, completed: true });
  });

  test('rejects an empty body with 400', async () => {
    const created = await createTask(alice);

    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth)
      .send({});

    expect(res.status).toBe(400);
  });

  test('rejects a body with only unknown fields with 400', async () => {
    const created = await createTask(alice);

    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth)
      .send({ priority: 'high' });

    expect(res.status).toBe(400);
  });

  test('rejects an invalid field value with 400', async () => {
    const created = await createTask(alice);

    const res = await request(app)
      .patch(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth)
      .send({ title: '' });

    expect(res.status).toBe(400);
  });

  test('returns 404 for a task that does not exist', async () => {
    const res = await request(app)
      .patch('/tasks/999999')
      .set('Authorization', alice.auth)
      .send({ completed: true });

    expect(res.status).toBe(404);
  });
});

describe('DELETE /tasks/:id', () => {
  test('deletes the task, and it is gone afterwards', async () => {
    const created = await createTask(alice);

    const res = await request(app)
      .delete(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    const after = await request(app)
      .get(`/tasks/${created.body.id}`)
      .set('Authorization', alice.auth);

    expect(after.status).toBe(404);
  });

  test('returns 404 for a task that does not exist', async () => {
    const res = await request(app).delete('/tasks/999999').set('Authorization', alice.auth);

    expect(res.status).toBe(404);
  });
});

// The most important block in this file. Every query filters on user_id;
// these tests fail the day someone drops that filter from a route.
describe("one user cannot touch another user's tasks", () => {
  let aliceTask;

  beforeEach(async () => {
    aliceTask = (await createTask(alice)).body;
  });

  test('Bob gets 404 reading it', async () => {
    const res = await request(app)
      .get(`/tasks/${aliceTask.id}`)
      .set('Authorization', bob.auth);

    expect(res.status).toBe(404);
  });

  test('Bob gets 404 updating it, and it is unchanged', async () => {
    const res = await request(app)
      .patch(`/tasks/${aliceTask.id}`)
      .set('Authorization', bob.auth)
      .send({ title: 'Hijacked' });

    expect(res.status).toBe(404);

    const check = await request(app)
      .get(`/tasks/${aliceTask.id}`)
      .set('Authorization', alice.auth);

    expect(check.body).toEqual(aliceTask);
  });

  test('Bob gets 404 deleting it, and it still exists', async () => {
    const res = await request(app)
      .delete(`/tasks/${aliceTask.id}`)
      .set('Authorization', bob.auth);

    expect(res.status).toBe(404);

    const check = await request(app)
      .get(`/tasks/${aliceTask.id}`)
      .set('Authorization', alice.auth);

    expect(check.status).toBe(200);
  });
});
