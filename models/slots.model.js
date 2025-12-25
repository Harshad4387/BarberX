const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BarberService",
    required: true
  },

  startTime: {
    type: String, // "09:00"
    required: true
  },

  endTime: {
    type: String, // "09:30"
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Slot", slotSchema);
