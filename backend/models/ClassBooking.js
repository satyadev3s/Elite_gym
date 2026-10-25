const mongoose = require('mongoose');
const { isMongoConnected } = require('../config/db');
const localDb = require('../database/localDb');

const bookingSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true },
    memberName: { type: String, required: true },
    memberEmail: { type: String, required: true },
    className: { type: String, required: true },
    category: { type: String, default: 'General' },
    instructor: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: String, default: '60 min' },
    status: { type: String, enum: ['confirmed', 'cancelled', 'waitlisted'], default: 'confirmed' },
  },
  { timestamps: true }
);

let MongoBooking;
try {
  MongoBooking = mongoose.model('ClassBooking', bookingSchema);
} catch {
  MongoBooking = mongoose.model('ClassBooking');
}

const ClassBooking = {
  async find(query = {}) {
    if (isMongoConnected()) return await MongoBooking.find(query).sort({ createdAt: -1 }).lean();
    return localDb.find('bookings', query);
  },

  async findOne(query = {}) {
    if (isMongoConnected()) return await MongoBooking.findOne(query).lean();
    return localDb.findOne('bookings', query);
  },

  async findById(id) {
    if (isMongoConnected()) return await MongoBooking.findById(id).lean();
    return localDb.findById('bookings', id);
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = new MongoBooking(data);
      return await doc.save();
    }
    return localDb.create('bookings', data);
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoBooking.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    return localDb.findByIdAndUpdate('bookings', id, updates);
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoBooking.findByIdAndDelete(id);
    }
    return localDb.findByIdAndDelete('bookings', id);
  },
};

module.exports = ClassBooking;
