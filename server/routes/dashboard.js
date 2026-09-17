const router = require("express").Router(),
  Connector = require("../models/Connector"),
  Tx = require("../models/StockTransaction"),
  auth = require("../middleware/auth");
router.use(auth);
router.get("/", async (req, res) => {
  const [total, low, units, ins, outs, recent] = await Promise.all([
    Connector.countDocuments(),
    Connector.countDocuments({
      $expr: { $lte: ["$currentStock", "$minimumStock"] },
    }),
    Connector.aggregate([
      { $group: { _id: null, total: { $sum: "$currentStock" } } },
    ]),
    Tx.countDocuments({
      type: "IN",
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    Tx.countDocuments({
      type: "OUT",
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    }),
    Tx.find()
      .populate("connector", "name partNumber")
      .sort({ createdAt: -1 })
      .limit(8),
  ]);
  res.json({
    totalConnectors: total,
    lowStock: low,
    totalUnits: units[0]?.total || 0,
    todayIn: ins,
    todayOut: outs,
    recent,
  });
});
module.exports = router;
