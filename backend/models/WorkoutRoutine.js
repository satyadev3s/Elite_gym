const mongoose = require('mongoose');
const { isMongoConnected } = require('../config/db');
const localDb = require('../database/localDb');

const routineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'Conditioning' },
    difficulty: { type: String, default: 'Intermediate' },
    duration: { type: String, default: '45 mins' },
    exercises: { type: Array, default: [] },
    isCustom: { type: Boolean, default: false },
    createdBy: { type: String, default: 'IronFit Staff' },
  },
  { timestamps: true }
);

let MongoRoutine;
try {
  MongoRoutine = mongoose.model('WorkoutRoutine', routineSchema);
} catch {
  MongoRoutine = mongoose.model('WorkoutRoutine');
}

const WorkoutRoutine = {
  async find(query = {}) {
    if (isMongoConnected()) return await MongoRoutine.find(query).lean();
    return localDb.find('routines', query);
  },

  async findOne(query = {}) {
    if (isMongoConnected()) return await MongoRoutine.findOne(query).lean();
    return localDb.findOne('routines', query);
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = new MongoRoutine(data);
      return await doc.save();
    }
    return localDb.create('routines', data);
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoRoutine.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    return localDb.findByIdAndUpdate('routines', id, updates);
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoRoutine.findByIdAndDelete(id);
    }
    return localDb.findByIdAndDelete('routines', id);
  },
};

module.exports = WorkoutRoutine;
