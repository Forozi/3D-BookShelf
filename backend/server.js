// --- START OF FILE server.js ---
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vanhptit',
    database: 'bookdb'
});

db.connect(err => {
    if (err) console.error('Database connection failed:', err.stack);
    else console.log('Connected to MySQL database.');
});

// File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// --- HELPER ---
const mapBook = (row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    genre: row.genre,
    publishDate: row.publish_date,
    notes: row.notes || "",
    coverUrl: row.cover_url ? `http://localhost:5000/uploads/${row.cover_url}` : null,
    rating: row.rating,
    is_completed: Boolean(row.is_completed)
});

// --- API ROUTES ---

// 1. AUTH: Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";
    
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        res.json({ 
            success: true, 
            user: { id: results[0].id, name: results[0].username } 
        });
    });
});

// 2. AUTH: Register
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "User already exists" });
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, userId: result.insertId });
    });
});

// 3. BOOKS: Get All (With Pagination)
app.get('/api/books', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ message: "User ID required" });

    const sql = "SELECT * FROM books WHERE user_id = ? ORDER BY created_at ASC";
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        // Map all rows to frontend structure
        const books = results.map(mapBook);
        res.json(books);
    });
});

// 4. Add BOOKS
app.post('/api/books', upload.single('cover'), (req, res) => {
    const { userId, title, author, genre, publishDate, notes } = req.body;
    const coverFilename = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO books (user_id, title, author, genre, publish_date, notes, cover_url, rating, is_completed) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)
    `;

    db.query(sql, [userId, title, author, genre, publishDate, notes, coverFilename], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ 
            success: true, 
            book: mapBook({
                id: result.insertId,
                title, author, genre, publish_date: publishDate, notes, 
                cover_url: coverFilename, rating: 0, is_completed: 0
            })
        });
    });
});

// 5. Update BOOKS
app.put('/api/books/:id', upload.single('cover'), (req, res) => {
    const bookId = req.params.id;
    const { title, author, genre, publishDate, notes, rating, is_completed } = req.body;
    
    let fields = [];
    let values = [];

    if (title !== undefined) { fields.push('title=?'); values.push(title); }
    if (author !== undefined) { fields.push('author=?'); values.push(author); }
    if (genre !== undefined) { fields.push('genre=?'); values.push(genre); }
    if (publishDate !== undefined) { fields.push('publish_date=?'); values.push(publishDate); }
    if (notes !== undefined) { fields.push('notes=?'); values.push(notes); }
    if (rating !== undefined) { fields.push('rating=?'); values.push(rating); }
    if (is_completed !== undefined) { fields.push('is_completed=?'); values.push(is_completed === 'true' || is_completed === true ? 1 : 0); }
    
    // CAPTURE NEW FILENAME
    let newCoverUrl = null;
    if (req.file) { 
        fields.push('cover_url=?'); 
        values.push(req.file.filename); 
        newCoverUrl = req.file.filename;
    }

    if (fields.length === 0) return res.json({ success: true });

    const sql = `UPDATE books SET ${fields.join(', ')} WHERE id = ?`;
    values.push(bookId);

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // RETURN THE NEW FILENAME SO FRONTEND CAN UPDATE INSTANTLY
        res.json({ success: true, newCoverUrl: newCoverUrl });
    });
});

// 6. Delete BOOKS
app.delete('/api/books/:id', (req, res) => {
    db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));