const mongoose = require('mongoose');
const { isMongoConnected } = require('../config/db');
const localDb = require('../database/localDb');

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    tier: { type: String, default: 'Iron Pro Athlete' },
    tierBadge: { type: String, default: '⭐ Pro Member' },
    memberId: { type: String, default: () => `IF-${Math.floor(100000 + Math.random() * 900000)}` },
    goal: { type: String, default: 'Muscle Hypertrophy & Strength' },
    avatar: {
      type: String,
      default: '',
    },
    joinedDate: {
      type: String,
      default: () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['member', 'trainer', 'admin'], default: 'member' },
  },
  { timestamps: true }
);

let MongoMember;
try {
  MongoMember = mongoose.model('Member', memberSchema);
} catch {
  MongoMember = mongoose.model('Member');
}

const Member = {
  async find(query = {}) {
    if (isMongoConnected()) return await MongoMember.find(query).lean();
    return localDb.find('members', query);
  },

  async findOne(query = {}) {
    if (isMongoConnected()) return await MongoMember.findOne(query).lean();
    return localDb.findOne('members', query);
  },

  async findById(id) {
    if (isMongoConnected()) return await MongoMember.findById(id).lean();
    return localDb.findById('members', id);
  },

  async create(data) {
    if (isMongoConnected()) {
      const doc = new MongoMember(data);
      return await doc.save();
    }
    return localDb.create('members', data);
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoMember.findByIdAndUpdate(id, updates, { new: true }).lean();
    }
    return localDb.findByIdAndUpdate('members', id, updates);
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoMember.findByIdAndDelete(id);
    }
    return localDb.findByIdAndDelete('members', id);
  },

  async deleteMany(query = {}) {
    if (isMongoConnected()) {
      return await MongoMember.deleteMany(query);
    }
    // localDb clear matching
    const items = localDb.find('members', {});
    const kept = items.filter(i => query.email && i.email !== query.email);
    const fs = require('fs');
    const path = require('path');
    fs.writeFileSync(path.join(__dirname, '../database/data/members.json'), JSON.stringify(kept, null, 2));
    return { deletedCount: items.length - kept.length };
  }
};

module.exports = Member;
