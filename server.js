require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

async function startServer() {
  try {
    mongoose.set('bufferTimeoutMS', 30000);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      family: 4,
      heartbeatFrequencyMS: 5000,
      maxPoolSize: 10,
    });
    console.log('Connected to MongoDB');
    // Monitor connection state every 3 seconds
    setInterval(() => {
      console.log('DB state:', mongoose.connection.readyState, '(1=connected, 0=disconnected, 2=connecting)');
    }, 3000);

    // Routes — only registered after DB is ready
    app.use('/api/clients', require('./routes/clients'));
    app.use('/api/invoices', require('./routes/invoices'));
    app.use('/api/payments', require('./routes/payments'));

    // Frontend pages
    app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/clients', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'clients.html')));
    app.get('/invoices', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'invoices.html')));
    app.get('/payments', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'payments.html')));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
