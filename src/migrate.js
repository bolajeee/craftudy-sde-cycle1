
const fs = require("node:fs/promises");
const path = require("node:path");
const pool = require("./db");

const migrationsDirectory = path.join(__dirname, "..", "migrations");


async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = await fs.readdir(migrationsDirectory);

  const migrationFiles = files
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const { rows } = await pool.query(
    "SELECT filename FROM schema_migrations"
  );

  const appliedMigrations = new Set(
    rows.map((row) => row.filename)
  );

  const pendingMigrations = migrationFiles.filter(
    (file) => !appliedMigrations.has(file)
  );

  for (const file of pendingMigrations) {
    const sql = await fs.readFile(
      path.join(migrationsDirectory, file),
      "utf8"
    );

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(sql);

      await client.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1)",
        [file]
      );

      await client.query("COMMIT");

      console.log(`Applied migration: ${file}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  if (pendingMigrations.length === 0) {
    console.log("No pending migrations.");
  }
}

runMigrations()
  .catch((error) => {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
