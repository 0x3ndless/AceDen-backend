const mongoose = require('mongoose');

const BetSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  opponent: {
    type: String,
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
    type: Number,
    default: 0,
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