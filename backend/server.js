require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getDBStatus } = require('./config/db');
const seedData = require('./database/seed');

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const contactRoutes = require('./routes/contactRoutes');
const progressRoutes = require('./routes/progressRoutes');
const routineRoutes = require('./routes/routineRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets if requested through API
app.use('/assets/images', express.static(path.join(__dirname, '../frontend/src/assets/images')));
app.use('/assets/videos', express.static(path.join(__dirname, '../frontend/public/videos')));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'IronFit Elite Backend API',
    database: getDBStatus(),
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/routines', routineRoutes);

// Global 404 Handler for API
app.use((req, res) => {
  res.status(404).json({ success: false, message: `API endpoint ${req.originalUrl} not found.` });
});

// Initialize Database & Server
const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 IronFit Elite Backend Server Active`);
      console.log(`🌐 API Endpoint:  http://localhost:${PORT}/api/health`);
      console.log(`🗄️ Database:      ${getDBStatus().type}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Fatal server boot failure:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
