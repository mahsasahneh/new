const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db } = require('./db');
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get('/books', (req, res) => {
  db.all(`SELECT * FROM books`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/books/:id', (req, res) => {
  db.get('SELECT * FROM books WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(row);
  });
});

app.post('/books', (req, res) => {
  const book = req.body;
  db.run(`INSERT INTO books (title, author, genre, year, quantity) VALUES (?, ?, ?, ?, ?)`, 
  [book.title, book.author, book.genre, book.year, book.quantity], 
  function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.delete('/books/:id', (req, res) => {
  db.run(`DELETE FROM books WHERE id = ?`, req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ deleted: this.changes });
  });
});

app.put('/books/:id', (req, res) => {
  const book = req.body;
  db.run(`UPDATE books SET title = ?, author = ?, genre = ?, year = ?, quantity = ? WHERE id = ?`,
  [book.title, book.author, book.genre, book.year, book.quantity, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ updated: this.changes });
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
