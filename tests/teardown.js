const pool = require('../src/db');

// Each test file gets its own copy of every module, so this closes that file's pool.
// Without it, Jest waits on open connections and warns "did not exit".
afterAll(() => pool.end());
