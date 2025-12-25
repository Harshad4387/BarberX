const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  barberId: { type: mongoose.Schema.Types.ObjectId, ref: "Barber" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "BarberService" },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },

  date: { type: Date, required: true },

  startTime: String,
  endTime: String,

  status: {
    type: String,
    enum: ["Booked", "UnBooked"],
    default: "Booked"
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
