const ContactMessage = require('../models/ContactMessage');

const contactController = {
  // POST /api/contact
  async submitMessage(req, res) {
    try {
      const { name, email, phone = '', message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and message are required fields.',
        });
      }

      const newContact = await ContactMessage.create({
        name,
        email,
        phone,
        message,
        status: 'new',
      });

      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been received. Our team will contact you shortly.',
        contact: newContact,
      });
    } catch (err) {
      console.error('Contact submit error:', err);
      return res.status(500).json({ success: false, message: 'Server error saving contact inquiry.' });
    }
  },

  // GET /api/contact
  async getMessages(req, res) {
    try {
      const messages = await ContactMessage.find();
      return res.json({ success: true, count: messages.length, messages });
    } catch (err) {
      console.error('Error retrieving contact messages:', err);
      return res.status(500).json({ success: false, message: 'Server error retrieving messages.' });
    }
  },
};

module.exports = contactController;
