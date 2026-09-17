const router = require("express").Router(),
  bcrypt = require("bcryptjs"),
  User = require("../models/User"),
  auth = require("../middleware/auth");
router.use(auth);
const admin = (req, res, next) =>
  req.user.role === "admin"
    ? next()
    : res.status(403).json({ message: "Admin access required" });
router.get("/", admin, async (req, res) =>
  res.json(await User.find().select("-password").sort({ createdAt: -1 })),
);
router.patch("/:id", admin, async (req, res) => {
  try {
    const data = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.role) data.role = req.body.role;
    if (req.body.password)
      data.password = await bcrypt.hash(req.body.password, 10);
    res.json(
      await User.findByIdAndUpdate(req.params.id, data, { new: true }).select(
        "-password",
      ),
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
module.exports = router;
