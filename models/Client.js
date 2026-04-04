const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  businessName: { type: String },
  email:        { type: String },
  phone:        { type: String },
  address:      { type: String },
  service:      { type: String }, // e.g. Monthly Bookkeeping, Payroll, Tax Filing
  notes:        { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
