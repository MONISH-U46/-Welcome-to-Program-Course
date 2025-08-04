const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use('/videos', express.static('videos'));
app.use('/notes', express.static('notes'));
app.use(express.urlencoded({ extended: true }));

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype === 'application/pdf' ? 'notes' : 'videos';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('material'), (req, res) => {
  res.redirect('/dashboard.html');
});

// API to get uploaded video files
app.get('/api/videos', (req, res) => {
  fs.readdir('./videos', (err, files) => {
    if (err) return res.status(500).send('Error reading video directory');
    const videoFiles = files.filter(file => file.endsWith('.mp4'));
    res.json(videoFiles);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
