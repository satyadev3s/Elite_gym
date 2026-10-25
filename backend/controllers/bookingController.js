const ClassBooking = require('../models/ClassBooking');

const bookingController = {
  // GET /api/bookings
  async getBookings(req, res) {
    try {
      const { email, memberId } = req.query;
      const query = {};
      if (email) query.memberEmail = email.toLowerCase();
      if (memberId) query.memberId = memberId;

      const bookings = await ClassBooking.find(query);
      return res.json({ success: true, count: bookings.length, bookings });
    } catch (err) {
      console.error('Error fetching bookings:', err);
      return res.status(500).json({ success: false, message: 'Server error retrieving bookings.' });
    }
  },

  // POST /api/bookings
  async createBooking(req, res) {
    try {
      const {
        memberId = '',
        memberName = '',
        memberEmail = '',
        className,
        category = 'General',
        instructor,
        day,
        time,
        duration = '60 min',
      } = req.body;

      if (!className || !instructor || !day || !time) {
        return res.status(400).json({
          success: false,
          message: 'Class name, instructor, day, and time are required.',
        });
      }

      // Check if already booked
      const existing = await ClassBooking.findOne({
        memberEmail: memberEmail.toLowerCase(),
        className,
        day,
        time,
        status: 'confirmed',
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: `You are already registered for ${className} on ${day} at ${time}.`,
        });
      }

      const booking = await ClassBooking.create({
        memberId,
        memberName,
        memberEmail: memberEmail.toLowerCase(),
        className,
        category,
        instructor,
        day,
        time,
        duration,
        status: 'confirmed',
      });

      return res.status(201).json({
        success: true,
        message: `Successfully booked ${className} with ${instructor}!`,
        booking,
      });
    } catch (err) {
      console.error('Booking error:', err);
      return res.status(500).json({ success: false, message: 'Server error creating booking.' });
    }
  },

  // DELETE /api/bookings/:id
  async cancelBooking(req, res) {
    try {
      const { id } = req.params;
      const booking = await ClassBooking.findById(id);

      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      await ClassBooking.findByIdAndUpdate(id, { status: 'cancelled' });
      return res.json({ success: true, message: 'Class booking cancelled successfully.' });
    } catch (err) {
      console.error('Cancel booking error:', err);
      return res.status(500).json({ success: false, message: 'Server error cancelling booking.' });
    }
  },
};

module.exports = bookingController;
