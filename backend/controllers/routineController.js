const WorkoutRoutine = require('../models/WorkoutRoutine');

const routineController = {
  // GET /api/routines
  async getRoutines(req, res) {
    try {
      const routines = await WorkoutRoutine.find();
      return res.json({ success: true, count: routines.length, routines });
    } catch (err) {
      console.error('Error fetching routines:', err);
      return res.status(500).json({ success: false, message: 'Server error retrieving workout routines.' });
    }
  },

  // POST /api/routines
  async createRoutine(req, res) {
    try {
      const { title, category = 'Conditioning', difficulty = 'Intermediate', duration = '45 mins', exercises = [], createdBy = 'Alex Morgan' } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Routine title is required.' });
      }

      const routine = await WorkoutRoutine.create({
        title,
        category,
        difficulty,
        duration,
        exercises,
        isCustom: true,
        createdBy,
      });

      return res.status(201).json({ success: true, message: 'Custom routine saved successfully!', routine });
    } catch (err) {
      console.error('Routine create error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving custom routine.' });
    }
  },
};

module.exports = routineController;
