# Tasks API

A REST API for personal task lists. Users sign up, log in for a JWT, and manage only their own tasks.

Node · Express 5 · PostgreSQL · Zod · JWT · Jest + Supertest. Built during the Craftudy SDE programme, cycle 1.

## Prerequisites

- Node.js 22 LTS (20.6 is the minimum, for `--env-file`)
- PostgreSQL 14 or later, running locally, **or** Docker to run it for you

## Setup

```bash
git clone https://github.com/bolajeee/craftudy-sde-cycle1.git
cd craftudy-sde-cycle1
npm ci
cp .env.example .env
cp .env.test.example .env.test
```

### Create the databases

The example env files expect a user `app` (password `app`) owning two databases: `tasks` for development and `tasks_test` for the test suite.

**With Docker:**

```bash
docker run -d --name tasks-db -p 5432:5432 \
  -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app -e POSTGRES_DB=tasks \
  postgres:16
docker exec tasks-db createdb -U app tasks_test
```

**With a local PostgreSQL install:**

```bash
sudo -u postgres psql -c "CREATE ROLE app LOGIN PASSWORD 'app';"
sudo -u postgres createdb -O app tasks
sudo -u postgres createdb -O app tasks_test
```

If you use different credentials, update `DATABASE_URL` in `.env` and `.env.test`.

### Run the migrations

```bash
npm run migrate        # development database
npm run migrate:test   # test database
```

Migrations are plain SQL files in `migrations/`, applied in filename order. Each one is recorded in a `schema_migrations` table, so re-running is safe.

## Run the tests

```bash
npm test
```

The suite runs against `tasks_test` and wipes it between tests. As a safety net, it refuses to start if `DATABASE_URL` in `.env.test` doesn't contain the word `test`.

```bash
npm run lint      # ESLint
npm run format    # Prettier (rewrites files)
```

## Run the API

```bash
npm start
```

The API listens on `PORT` from `.env` (3000 in the example). Check it's up:

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```

## Environment variables

| Variable       | Used for                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| `PORT`         | Port the server listens on. Defaults to 4000 if unset.                   |
| `DATABASE_URL` | PostgreSQL connection string. Required, the app won't start without it.  |
| `JWT_SECRET`   | Signs and verifies login tokens. Use a long random value outside dev.    |

`.env` and `.env.test` are git-ignored. Never commit real secrets.

## API

All request and response bodies are JSON.

### Auth

| Method | Path           | Body                                          | Success             |
| ------ | -------------- | --------------------------------------------- | ------------------- |
| POST   | `/auth/signup` | `name`, `email`, `password`, `confirmPassword` | `201` with the user |
| POST   | `/auth/login`  | `email`, `password`                           | `200` with a token  |

- Passwords need at least 8 characters, names at least 3.
- Login is rate-limited to 5 attempts per IP per 15 minutes (`429` after that).
- A wrong password and an unknown email return the same `401`, so the API never reveals which emails are registered.

### Tasks

Every `/tasks` route needs the token from login:

```
Authorization: Bearer <token>
```

| Method | Path         | Body                                 | Success            |
| ------ | ------------ | ------------------------------------ | ------------------ |
| GET    | `/tasks`     |                                      | `200`, your tasks  |
| POST   | `/tasks`     | `title` (string), `completed` (bool) | `201`, the task    |
| GET    | `/tasks/:id` |                                      | `200`, the task    |
| PATCH  | `/tasks/:id` | `title` and/or `completed`           | `200`, the task    |
| DELETE | `/tasks/:id` |                                      | `204`, no body     |

Requests for another user's task return `404`, the same as a task that doesn't exist.

### Example

```bash
curl -X POST localhost:3000/auth/signup -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com","password":"password123","confirmPassword":"password123"}'

TOKEN=$(curl -s -X POST localhost:3000/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"ada@example.com","password":"password123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -X POST localhost:3000/tasks -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' -d '{"title":"Write the README","completed":false}'
```

## Project layout

```
src/
  app.js          Express app: middleware, routes, 404 and error handlers
  server.js       Starts the app (kept separate so tests can import app.js)
  db.js           PostgreSQL connection pool
  migrate.js      Migration runner
  routes/         /auth and /tasks
  middleware/     JWT verification
  validation.js   Zod schemas
migrations/       SQL migrations
tests/            Jest + Supertest suites and helpers
dsa/              Weekly data structures and algorithms problems
logs/             Daily learning logs, one file per day
```

## Working on this repo

One branch per week (`week-6`), a log pushed every day, and a pull request into `main` per week. See [SUBMISSION.md](SUBMISSION.md).
