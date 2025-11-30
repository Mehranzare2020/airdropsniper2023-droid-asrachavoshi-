const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// Serve Static files from React App (Vite build output)
// This allows the Node server to serve the frontend directly
app.use(express.static(path.join(__dirname, 'dist')));

// Database Connection Logic
let pool;

function getDbPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'h334929_mehran1',
      password: process.env.DB_PASSWORD || 'xZ8_xI5-mK9-rV8_',
      database: process.env.DB_NAME || 'h334929_mehran1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      charset: 'utf8mb4',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Helper for query execution
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    getDbPool().query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// --- API ROUTES ---

// 1. GET ALL DATA (Sync)
app.get('/api/sync', async (req, res) => {
  try {
    const artworks = await query('SELECT * FROM artworks ORDER BY created_at DESC');
    const books = await query('SELECT * FROM books ORDER BY created_at DESC');
    const journal = await query('SELECT * FROM journal_posts ORDER BY created_at DESC');
    
    const processedJournal = journal.map(post => ({
      ...post,
      tags: post.tags ? post.tags.split(',') : []
    }));

    res.json({
      artworks,
      books,
      journal: processedJournal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database fetch error' });
  }
});

// 2. ARTWORKS
app.post('/api/artworks', async (req, res) => {
  const art = req.body;
  const sql = `
    INSERT INTO artworks 
    (id, title, title_fa, title_fr, title_de, title_ru, title_tr, title_ar, title_zh, description, description_fa, description_fr, description_de, description_ru, description_tr, description_ar, description_zh, year, category, imageUrl, featured, technique, technique_fa, technique_fr, technique_de, technique_ru, technique_tr, technique_ar, technique_zh)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    art.id, art.title, art.title_fa, art.title_fr, art.title_de, art.title_ru, art.title_tr, art.title_ar, art.title_zh,
    art.description, art.description_fa, art.description_fr, art.description_de, art.description_ru, art.description_tr, art.description_ar, art.description_zh,
    art.year, art.category, art.imageUrl, art.featured,
    art.technique, art.technique_fa, art.technique_fr, art.technique_de, art.technique_ru, art.technique_tr, art.technique_ar, art.technique_zh
  ];

  try {
    await query(sql, values);
    res.json({ success: true, message: 'Artwork added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/artworks/:id', async (req, res) => {
  try {
    await query('DELETE FROM artworks WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. BOOKS
app.post('/api/books', async (req, res) => {
  const book = req.body;
  const sql = `
    INSERT INTO books 
    (id, title, title_fa, title_fr, title_de, title_ru, title_tr, title_ar, title_zh, 
     subtitle, subtitle_fa, subtitle_fr, subtitle_de, subtitle_ru, subtitle_tr, subtitle_ar, subtitle_zh,
     description, description_fa, description_fr, description_de, description_ru, description_tr, description_ar, description_zh,
     price, coverUrl, pages, publishDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    book.id, book.title, book.title_fa, book.title_fr, book.title_de, book.title_ru, book.title_tr, book.title_ar, book.title_zh,
    book.subtitle, book.subtitle_fa, book.subtitle_fr, book.subtitle_de, book.subtitle_ru, book.subtitle_tr, book.subtitle_ar, book.subtitle_zh,
    book.description, book.description_fa, book.description_fr, book.description_de, book.description_ru, book.description_tr, book.description_ar, book.description_zh,
    book.price, book.coverUrl, book.pages, book.publishDate
  ];

  try {
    await query(sql, values);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    await query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. JOURNAL
app.post('/api/journal', async (req, res) => {
  const post = req.body;
  const tagsString = post.tags ? post.tags.join(',') : '';
  const sql = `
    INSERT INTO journal_posts 
    (id, title, title_fa, title_fr, title_de, title_ru, title_tr, title_ar, title_zh,
     excerpt, excerpt_fa, excerpt_fr, excerpt_de, excerpt_ru, excerpt_tr, excerpt_ar, excerpt_zh,
     content, content_fa, date, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    post.id, post.title, post.title_fa, post.title_fr, post.title_de, post.title_ru, post.title_tr, post.title_ar, post.title_zh,
    post.excerpt, post.excerpt_fa, post.excerpt_fr, post.excerpt_de, post.excerpt_ru, post.excerpt_tr, post.excerpt_ar, post.excerpt_zh,
    post.content, post.content_fa, post.date, tagsString
  ];

  try {
    await query(sql, values);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/journal/:id', async (req, res) => {
  try {
    await query('DELETE FROM journal_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CATCH ALL ROUTE FOR REACT (Must be last) ---
// Any request that isn't an API request gets sent to the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;