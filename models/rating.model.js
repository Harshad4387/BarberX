const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    review: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

// ✅ One rating per user per barber
ratingSchema.index(
  { barberId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
