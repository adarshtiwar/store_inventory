const router = require("express").Router(),
  Connector = require("../models/Connector"),
  Tx = require("../models/StockTransaction"),
  auth = require("../middleware/auth");
router.use(auth);
router.get("/", async (req, res) => {
  try {
    res.json(
      await Tx.find()
        .populate("connector", "name partNumber unit")
        .sort({ createdAt: -1 })
        .limit(500),
    );
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const {
      connectorId,
      type,
      quantity,
      person,
      supplier,
      invoiceNumber,
      reason,
      reference,
    } = req.body;
    const qty = Number(quantity);
    if (
      !connectorId ||
      !["IN", "OUT"].includes(type) ||
      !Number.isFinite(qty) ||
      qty <= 0
    )
      return res.status(400).json({ message: "Invalid stock operation" });
    const current = await Connector.findById(connectorId);
    if (!current)
      return res.status(404).json({ message: "Connector not found" });
    let updated;
    if (type === "IN") {
      updated = await Connector.findOneAndUpdate(
        { _id: connectorId },
        { $inc: { currentStock: qty } },
        { new: true },
      );
    } else {
      updated = await Connector.findOneAndUpdate(
        { _id: connectorId, currentStock: { $gte: qty } },
        { $inc: { currentStock: -qty } },
        { new: true },
      );
      if (!updated)
        return res
          .status(400)
          .json({
            message: `Insufficient stock. Available: ${current.currentStock}`,
          });
    }
    const previous =
      type === "IN" ? updated.currentStock - qty : updated.currentStock + qty;
    try {
      const tx = await Tx.create({
        connector: connectorId,
        type,
        quantity: qty,
        previousStock: previous,
        newStock: updated.currentStock,
        person: person || req.user.name,
        supplier,
        invoiceNumber,
        reason,
        reference,
      });
      return res.status(201).json(tx);
    } catch (e) {
      await Connector.updateOne(
        { _id: connectorId, currentStock: updated.currentStock },
        { $inc: { currentStock: type === "IN" ? -qty : qty } },
      );
      throw e;
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
module.exports = router;
