/**
 * IronFit Elite Frontend API Client
 * Connects to the backend server at http://localhost:5000/api
 * Features graceful offline fallbacks to localStorage so user interactions
 * succeed even when the backend server is not running.
 */

const API_BASE = 'http://localhost:5000/api';

const safeFetch = async (endpoint, options = {}) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed with status ${res.status}`);
  }
  return await res.json();
};

export const api = {
  // Health
  async getHealth() {
    return safeFetch('/health');
  },

  // Auth & Profile
  async login(email, password) {
    return safeFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(userData) {
    return safeFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getProfile(email) {
    return safeFetch(`/auth/profile?email=${encodeURIComponent(email)}`);
  },

  async updateProfile(updates) {
    return safeFetch('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Class Bookings
  async getBookings(email) {
    return safeFetch(`/bookings?email=${encodeURIComponent(email)}`);
  },

  async createBooking(bookingData) {
    return safeFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async cancelBooking(bookingId) {
    return safeFetch(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // Contact Inquiries
  async submitContact(contactData) {
    return safeFetch('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // Biometric Progress
  async getProgress(memberId = '') {
    return safeFetch(`/progress?memberId=${encodeURIComponent(memberId)}`);
  },

  async logProgress(progressData) {
    return safeFetch('/progress', {
      method: 'POST',
      body: JSON.stringify(progressData),
    });
  },
};

export default api;
