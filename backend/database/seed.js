const Member = require('../models/Member');
const ClassBooking = require('../models/ClassBooking');
const ProgressLog = require('../models/ProgressLog');
const { connectDB } = require('../config/db');

const seedData = async () => {
  await connectDB();

  // Clean out any legacy static seed member accounts (e.g. Alex Morgan)
  try {
    await Member.deleteMany({ email: 'alex.morgan@ironfit.com' });
    await ClassBooking.deleteMany({ memberEmail: 'alex.morgan@ironfit.com' });
    await ProgressLog.deleteMany({ memberId: 'IF-839214' });
  } catch {
    // Ignore cleanup errors
  }

  console.log('✅ Seed check complete: No static dummy member accounts.');
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;
