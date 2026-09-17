const router = require("express").Router(),
  Connector = require("../models/Connector"),
  auth = require("../middleware/auth"),
  roles = require("../middleware/roles");
router.use(auth);
router.get("/", async (req, res) =>
  res.json(await Connector.find().sort({ updatedAt: -1 })),
);
router.post("/", roles("admin", "manager"), async (req, res) => {
  try {
    res.status(201).json(await Connector.create(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
router.put("/:id", roles("admin", "manager"), async (req, res) => {
  try {
    res.json(
      await Connector.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }),
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
router.delete("/:id", roles("admin"), async (req, res) => {
  await Connector.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
module.exports = router;
