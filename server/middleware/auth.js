const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Please log in to continue" });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
    if (!req.user) return res.status(401).json({ message: "Account no longer exists" });
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};
