const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
  uid: { type: String, unique: true, required: true },
  name: String,
  description: String,
  actions: [{ name: String, description: String }],
  lastMsg: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Device', DeviceSchema);
