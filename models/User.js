const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  wallet: {
    type: String
  },
  total_bets: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', UserSchema);
