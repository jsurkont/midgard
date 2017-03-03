const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  action: String,
  cron: String,
  createdAt: { type: Date, default: Date.now },
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
});

module.exports = mongoose.model('Job', JobSchema);
