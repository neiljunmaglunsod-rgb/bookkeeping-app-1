const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

function col() {
  return mongoose.connection.db.collection('expenses');
}

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await col().find({}).sort({ date: -1 }).toArray();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create expense
router.post('/', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date() };
    const result = await col().insertOne(doc);
    res.status(201).json({ _id: result.insertedId, ...doc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: new Date() };
    await col().updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
    const expense = await col().findOne({ _id: new ObjectId(req.params.id) });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    await col().deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
