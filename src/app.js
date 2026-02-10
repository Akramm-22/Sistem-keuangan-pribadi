// Import library
const express = require('express');
const dotenv = require('dotenv');

// Konfigurasi dotenv
dotenv.config();

// Import koneksi DB
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');

// Panggil koneksi database
connectDB();

// Inisialisasi Express
const app = express();

// Middleware
app.use(express.json());

// Pakai routes (INI YANG KURANG)
app.use('/api/users', userRoutes);
// Tambahkan setelah route Users
const financeRoutes = require('./routes/financeRoutes');
// Gunakan route finance
app.use('/api/finances', financeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
