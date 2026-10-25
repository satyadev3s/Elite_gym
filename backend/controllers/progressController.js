const ProgressLog = require('../models/ProgressLog');

const progressController = {
  // GET /api/progress
  async getProgress(req, res) {
    try {
      const { memberId = 'IF-839214' } = req.query;
      const history = await ProgressLog.find({ memberId });
      return res.json({ success: true, count: history.length, history });
    } catch (err) {
      console.error('Error fetching progress:', err);
      return res.status(500).json({ success: false, message: 'Server error retrieving biometric progress.' });
    }
  },

  // POST /api/progress
  async logProgress(req, res) {
    try {
      const {
        memberId = 'IF-839214',
        date = new Date().toISOString().split('T')[0],
        weightKg,
        chestInches = 0,
        waistInches = 0,
        hipsInches = 0,
        bicepsInches = 0,
        thighsInches = 0,
        bodyFatPercentage = 0,
        notes = '',
      } = req.body;

      if (!weightKg && !chestInches && !waistInches) {
        return res.status(400).json({
          success: false,
          message: 'At least one biometric landmark (weight, chest, or waist) must be provided.',
        });
      }

      const log = await ProgressLog.create({
        memberId,
        date,
        weightKg: Number(weightKg) || 0,
        chestInches: Number(chestInches) || 0,
        waistInches: Number(waistInches) || 0,
        hipsInches: Number(hipsInches) || 0,
        bicepsInches: Number(bicepsInches) || 0,
        thighsInches: Number(thighsInches) || 0,
        bodyFatPercentage: Number(bodyFatPercentage) || 0,
        notes,
      });

      return res.status(201).json({
        success: true,
        message: 'Biometric measurements logged successfully!',
        log,
      });
    } catch (err) {
      console.error('Progress log error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving progress log.' });
    }
  },

  // DELETE /api/progress/:id
  async deleteProgress(req, res) {
    try {
      const { id } = req.params;
      await ProgressLog.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Progress entry removed.' });
    } catch {
      return res.status(500).json({ success: false, message: 'Error deleting progress entry.' });
    }
  },
};

module.exports = progressController;
