const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, token: sign(u._id) });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "This email is already registered" });
    const user = await User.create({ name, email, password }); // role is always "customer"
    res.status(201).json(payload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Incorrect email or password" });
    res.json(payload(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => res.json(req.user));

module.exports = router;
