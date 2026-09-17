const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Supplier",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      contactPerson: String,
      phone: String,
      email: String,
      address: String,
      notes: String,
      active: { type: Boolean, default: true },
    },
    { timestamps: true },
  ),
);
