const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity:    { type: Number, default: 1 },
  rate:        { type: Number, required: true },
  amount:      { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  client:        { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  items:         [itemSchema],
  subtotal:      { type: Number, default: 0 },
  tax:           { type: Number, default: 0 },
  total:         { type: Number, default: 0 },
  dueDate:       { type: Date },
  status:        { type: String, enum: ['draft', 'sent', 'paid', 'overdue'], default: 'draft' },
  notes:         { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
