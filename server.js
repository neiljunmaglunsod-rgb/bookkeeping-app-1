const express = require('express');
const multer = require('multer');
const fs = require('fs');

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

// Home route
app.get('/', (req, res) => {
  res.send(`
    <h1>Upload Client Document</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully ✅');
});

// IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});const fs = require('fs');

// Create uploads folder if not exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}