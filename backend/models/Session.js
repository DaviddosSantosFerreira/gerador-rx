const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  type: { type: String, enum: ['video', 'image', 'audio'], required: true },
  prompt: { type: String },
  model: { type: String },
  duration: { type: String },
  resolution: { type: String },
  style: { type: String },
  outputUrl: { type: String },
  predictionId: { type: String },
  status: { type: String, enum: ['queued', 'generating', 'completed', 'failed'], default: 'queued' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);

