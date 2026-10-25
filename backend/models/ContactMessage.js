const mongoose = require('mongoose');
const { isMongoConnected } = require('../config/db');
const localDb = require('../database/localDb');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

let MongoContact;
try {
  MongoContact = mongoose.model('ContactMessage', contactSchema);
} catch {
  MongoContact = mongoose.model('ContactMessage');
}

const ContactMessage = {
  async find(query = {}) {
    if (isMongoConnected()) return await MongoContact.find(query).sort({ createdAt: -1 }).lean();
    return localDb.find('contacts', query);
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = new MongoContact(data);
      return await doc.save();
    }
    return localDb.create('contacts', data);
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoContact.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    return localDb.findByIdAndUpdate('contacts', id, updates);
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoContact.findByIdAndDelete(id);
    }
    return localDb.findByIdAndDelete('contacts', id);
  },
};

module.exports = ContactMessage;
