const mongoose = require("mongoose");
module.exports = mongoose.model(
  "StockTransaction",
  new mongoose.Schema(
    {
      connector: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connector",
        required: true,
      },
      type: { type: String, enum: ["IN", "OUT", "ADJUSTMENT"], required: true },
      quantity: { type: Number, required: true },
      previousStock: { type: Number, required: true },
      newStock: { type: Number, required: true },
      person: { type: String, required: true },
      supplier: String,
      invoiceNumber: String,
      reason: String,
      reference: String,
    },
    { timestamps: true },
  ),
);
