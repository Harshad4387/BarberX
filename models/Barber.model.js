const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema(
  {
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true   
    },

    shopName: {
      type: String,
      required: true,
      trim: true
    },

    shopAddress: {
      type: String,
      required: true
    },

    gstNumber: {
      type: String,
      default: ""
    },

    openingTime: {
      type: String, 
      required: true
    },

    closingTime: {
      type: String, 
      required: true
    },

    isOpen: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barber", barberSchema);
