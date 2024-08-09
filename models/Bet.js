const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  betId: {
    type: Number,
  },
  creator: {
    type: String,
    required: true,
  },
  opponent: {
    type: String,
    default: null
  },
  bet_amount: {
    type: Number,
    default: 0,
  },
  targetPrice: {
    type: Number,
    default: 0,
  },
  endTime: {
    type: String,
    default: null
  },
  joinUntil: {
    type: String,
    default: null
  },
  creatorPrediction: {
    type: String,
  },
  assetType: {
    type: String,
  },
  isSettled: {
    type: Boolean,
    default: false
  },
  isDraw: {
    type: Boolean,
    default: false
  },
  creatorWins: {
    type: Boolean,
    default: false
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('bet', BetSchema);