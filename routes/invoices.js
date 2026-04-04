const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

function col() {
  return mongoose.connection.db.collection('invoices');
}

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await col().find({}).sort({ createdAt: -1 }).toArray();
    // Populate client names
    const clientCol = mongoose.connection.db.collection('clients');
    const populated = await Promise.all(invoices.map(async inv => {
      if (inv.client) {
        try {
          const client = await clientCol.findOne({ _id: new ObjectId(inv.client) });
          return { ...inv, client };
        } catch { return inv; }
      }
      return inv;
    }));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await col().findOne({ _id: new ObjectId(req.params.id) });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (invoice.client) {
      const client = await mongoose.connection.db.collection('clients').findOne({ _id: new ObjectId(invoice.client) });
      invoice.client = client;
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    const result = await col().insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: new Date() };
    await col().updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
    const invoice = await col().findOne({ _id: new ObjectId(req.params.id) });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    await col().deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
