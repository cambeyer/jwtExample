const mongoose = require('mongoose');
require('mongoose-type-email');

module.exports = mongoose.model('User', new mongoose.Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    correctTld: true,
    required: true,
    unique: true,
    trim: true,
  },
  roles: {
    type: [String],
    enum: ['Normal', 'Admin'],
    required: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    getters: true,
    virtuals: false,
  },
}));
