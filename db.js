const sqlite3 = require('sqlite3').verbose();

// Initialize a new database or open an existing one
let db = new sqlite3.Database('./books.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  author TEXT,
  genre TEXT,
  year INTEGER,
  quantity INTEGER
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

exports.db = db;
