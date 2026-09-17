const mongoose = require("mongoose");
module.exports = mongoose.model(
  "Connector",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      partNumber: { type: String, required: true, unique: true },
      category: { type: String, default: "Connector" },
      manufacturer: String,
      unit: { type: String, default: "pcs" },
      currentStock: { type: Number, default: 0, min: 0 },
      minimumStock: { type: Number, default: 10, min: 0 },
      location: String,
      description: String,
    },
    { timestamps: true },
  ),
);
