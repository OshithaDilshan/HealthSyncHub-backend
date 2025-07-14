const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loginDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);
module.exports = LoginHistory;
