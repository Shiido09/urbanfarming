const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./routes/userRoutes');

connectDB();

const app = express();

// CORS middleware - must be first
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'], // Add your frontend URLs
  credentials: true
}));

// Basic logging middleware (before body parsing)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Content-Length:', req.headers['content-length']);
  next();
});

// Body parsing middleware - for non-multipart requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes (multer middleware will handle multipart/form-data)
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('HarvestConnect API is working!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
