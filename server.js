const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Serve form
app.get('/', (req, res) => {
    res.send(`
        <h2>Upload Client Document</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="file" />
            <button type="submit">Upload</button>
        </form>
    `);
});

// Handle upload
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully ✅');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});