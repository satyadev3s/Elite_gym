const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ironfit_gym';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch {
    isMongoConnected = false;
    console.log('ℹ️ Local MongoDB instance not active. Using integrated embedded JSON database.');
  }
};

const getDBStatus = () => ({
  type: isMongoConnected ? 'MongoDB (Mongoose)' : 'Embedded Local JSON Database',
  connected: isMongoConnected,
});

module.exports = { connectDB, getDBStatus, isMongoConnected: () => isMongoConnected };
