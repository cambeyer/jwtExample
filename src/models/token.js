const mongoose = require('mongoose');
require('mongoose-type-email');

const tokenSchema = new mongoose.Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    correctTld: true,
    required: true,
  },
  guid: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  },
}, {
  toJSON: {
    getters: true,
    virtuals: false,
  },
});

tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', tokenSchema);
