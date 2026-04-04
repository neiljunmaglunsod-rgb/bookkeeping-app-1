const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
  client:  { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  amount:  { type: Number, required: true },
  date:    { type: Date, default: Date.now },
  method:  { type: String, enum: ['cash', 'bank transfer', 'check', 'gcash', 'other'], default: 'bank transfer' },
  notes:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
