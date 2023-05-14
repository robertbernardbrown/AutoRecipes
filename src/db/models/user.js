const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  givenNames: [{ type: String }],
  familyName: { type: String },
  displayName: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  facebookId: String,
  googleId: String,
  createdOn: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
