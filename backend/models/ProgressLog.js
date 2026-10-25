const mongoose = require('mongoose');
const { isMongoConnected } = require('../config/db');
const localDb = require('../database/localDb');

const progressSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true },
    date: { type: String, required: true },
    weightKg: { type: Number, required: true },
    chestInches: { type: Number, default: 0 },
    waistInches: { type: Number, default: 0 },
    hipsInches: { type: Number, default: 0 },
    bicepsInches: { type: Number, default: 0 },
    thighsInches: { type: Number, default: 0 },
    bodyFatPercentage: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

let MongoProgress;
try {
  MongoProgress = mongoose.model('ProgressLog', progressSchema);
} catch {
  MongoProgress = mongoose.model('ProgressLog');
}

const ProgressLog = {
  async find(query = {}) {
    if (isMongoConnected()) return await MongoProgress.find(query).sort({ createdAt: -1 }).lean();
    return localDb.find('progress', query);
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = new MongoProgress(data);
      return await doc.save();
    }
    return localDb.create('progress', data);
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoProgress.findByIdAndDelete(id);
    }
    return localDb.findByIdAndDelete('progress', id);
  },
};

module.exports = ProgressLog;
