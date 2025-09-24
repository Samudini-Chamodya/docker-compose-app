const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DB_DIR, 'tasks.db');

let db;

function initDb() {
	if (!fs.existsSync(DB_DIR)) {
		fs.mkdirSync(DB_DIR, { recursive: true });
	}
	db = new Database(DB_PATH);
	// PRAGMA for integrity and performance
	db.pragma('journal_mode = WAL');
	db.pragma('foreign_keys = ON');

	// Create schema if not exists
	db.prepare(`
		CREATE TABLE IF NOT EXISTS tasks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			description TEXT DEFAULT '',
			priority TEXT CHECK(priority IN ('low','medium','high')) DEFAULT 'medium',
			due_date TEXT,
			is_completed INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`).run();

	// Trigger to update updated_at automatically
	db.prepare(`
		CREATE TRIGGER IF NOT EXISTS trg_tasks_updated
		AFTER UPDATE ON tasks
		BEGIN
			UPDATE tasks SET updated_at = datetime('now') WHERE id = NEW.id;
		END;
	`).run();
}

module.exports = { db: new Proxy({}, {
	get(_, prop) {
		if (!db) throw new Error('Database not initialized. Call initDb() first.');
		return db[prop].bind(db);
	}
}), initDb, DB_PATH };
