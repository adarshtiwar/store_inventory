const router = require("express").Router(),
  bcrypt = require("bcryptjs"),
  jwt = require("jsonwebtoken"),
  User = require("../models/User");
const token = (u) =>
  jwt.sign(
    { id: u._id, name: u.name, email: u.email, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });
    const count = await User.countDocuments();
    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: count === 0 ? "admin" : "employee",
    });
    res.json({
      token: token(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body,
      user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({
      token: token(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
module.exports = router;
