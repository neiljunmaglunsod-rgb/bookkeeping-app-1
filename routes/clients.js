const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

function col() {
  return mongoose.connection.db.collection('clients');
}

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await col().find({}).sort({ createdAt: -1 }).toArray();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const client = await col().findOne({ _id: new ObjectId(req.params.id) });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    const result = await col().insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const update = { ...req.body, updatedAt: new Date() };
    await col().updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
    const client = await col().findOne({ _id: new ObjectId(req.params.id) });
    res.json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    await col().deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
