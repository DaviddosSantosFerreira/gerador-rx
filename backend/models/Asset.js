const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  type: { type: String, enum: ['image', 'video', 'audio'], required: true },
  size: { type: String },
  url: { type: String },
  tags: [{ type: String }],
  favorite: { type: Boolean, default: false },
  private: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Asset', assetSchema);

