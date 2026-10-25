const Member = require('../models/Member');

const authController = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { name, email, password, tier = 'Iron Pro Athlete', goal = 'Muscle Hypertrophy & Strength' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
      }

      const existing = await Member.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already registered. Please sign in.' });
      }

      const member = await Member.create({
        name,
        email: email.toLowerCase(),
        password, // In production, hash with bcryptjs
        tier,
        tierBadge: tier.includes('VIP') ? '👑 VIP Member' : tier.includes('Pro') ? '⭐ Pro Member' : '🥉 Starter Member',
        goal,
        avatar: '',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully!',
        user: {
          name: member.name,
          email: member.email,
          tier: member.tier,
          tierBadge: member.tierBadge,
          memberId: member.memberId,
          goal: member.goal,
          avatar: member.avatar,
          joinedDate: member.joinedDate,
        },
      });
    } catch (err) {
      console.error('Registration error:', err);
      return res.status(500).json({ success: false, message: 'Server error during registration.' });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
      }

      const member = await Member.findOne({ email: email.toLowerCase() });
      if (!member) {
        return res.status(401).json({ success: false, message: 'No account found with this email address.' });
      }

      // Password comparison
      if (member.password !== password) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your password.' });
      }

      return res.json({
        success: true,
        message: 'Login successful!',
        user: {
          name: member.name,
          email: member.email,
          tier: member.tier,
          tierBadge: member.tierBadge,
          memberId: member.memberId,
          goal: member.goal,
          avatar: member.avatar,
          joinedDate: member.joinedDate,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error during login.' });
    }
  },

  // GET /api/auth/profile
  async getProfile(req, res) {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email parameter is required.' });
      }
      const member = await Member.findOne({ email: email.toLowerCase() });

      if (!member) {
        return res.status(404).json({ success: false, message: 'Member profile not found.' });
      }

      return res.json({ success: true, user: member });
    } catch {
      return res.status(500).json({ success: false, message: 'Server error fetching profile.' });
    }
  },

  // PUT /api/auth/profile
  async updateProfile(req, res) {
    try {
      const { email, goal, tier, avatar, phone } = req.body;
      const member = await Member.findOne({ email: (email || '').toLowerCase() });

      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found.' });
      }

      const updates = {};
      if (goal) updates.goal = goal;
      if (tier) {
        updates.tier = tier;
        updates.tierBadge = tier.includes('VIP') ? '👑 VIP Member' : '⭐ Pro Member';
      }
      if (avatar) updates.avatar = avatar;
      if (phone) updates.phone = phone;

      const updated = await Member.findByIdAndUpdate(member._id, updates);
      return res.json({ success: true, message: 'Profile updated!', user: updated });
    } catch {
      return res.status(500).json({ success: false, message: 'Error updating profile.' });
    }
  },
};

module.exports = authController;
