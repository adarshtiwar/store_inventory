const router = require("express").Router(),
  Tx = require("../models/StockTransaction"),
  auth = require("../middleware/auth");
router.use(auth);
router.get("/summary", async (req, res) => {
  const days = Math.min(Number(req.query.days) || 30, 365);
  const from = new Date();
  from.setDate(from.getDate() - days);
  const rows = await Tx.aggregate([
    { $match: { createdAt: { $gte: from } } },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          type: "$type",
        },
        quantity: { $sum: "$quantity" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.date": 1 } },
  ]);
  res.json(rows);
});
module.exports = router;
