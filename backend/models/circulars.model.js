const mongoose = require("mongoose");

const circularSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    circularUrl: {
      type: String,
      required: true,
    },

    circularFor: {
        type: String,
      enum: ["teacher", "student", "both"],
      required: true,
    },
}, {timestamps: true});

module.exports = mongoose.model("circular", circularSchema);
