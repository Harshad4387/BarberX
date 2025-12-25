const mongoose = require("mongoose");

const barberServiceSchema = new mongoose.Schema(
  {
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true
    },

    serviceType: {
      type: String,
      enum: [
        "Haircut",
        "Beard",
        "Facial",
        "Massage",
        "Coloring",
        "Kids",
        "Other"
      ],
      required: true
    },

    workerName: {
      type: String,
      required: true
    },

    timeRequired: {
      type: Number,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarberService", barberServiceSchema);
