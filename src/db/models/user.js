const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  givenNames: [{ type: String, required: true }],
  familyName: { type: String, required: true },
  email: { type: Number, required: true },
  createdOn: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
