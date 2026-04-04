const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

function col() {
  return mongoose.connection.db.collection('payments');
}

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await col().find({}).sort({ date: -1 }).toArray();
    const clientCol = mongoose.connection.db.collection('clients');
    const invoiceCol = mongoose.connection.db.collection('invoices');
    const populated = await Promise.all(payments.map(async p => {
      const client = p.client ? await clientCol.findOne({ _id: new ObjectId(p.client) }).catch(() => null) : null;
      const invoice = p.invoice ? await invoiceCol.findOne({ _id: new ObjectId(p.invoice) }).catch(() => null) : null;
      return { ...p, client, invoice };
    }));
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record a payment
router.post('/', async (req, res) => {
  try {
    const doc = { ...req.body, date: new Date(req.body.date || Date.now()), createdAt: new Date() };
    const result = await col().insertOne(doc);
    // Mark invoice as paid
    if (doc.invoice) {
      await mongoose.connection.db.collection('invoices').updateOne(
        { _id: new ObjectId(doc.invoice) },
        { $set: { status: 'paid' } }
      );
    }
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    await col().deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
