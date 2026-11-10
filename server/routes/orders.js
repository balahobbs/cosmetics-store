const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

// POST /api/orders — prices are read from the DB, never trusted from the client
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items?.length) return res.status(400).json({ message: "Your cart is empty" });

    const orderItems = [];
    let totalPrice = 0;

    for (const { product: id, qty } of items) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "A product in your cart no longer exists" });
      if (product.stock < qty)
        return res.status(400).json({ message: `Only ${product.stock} left of ${product.name}` });
      orderItems.push({ product: product._id, name: product.name, price: product.price, qty });
      totalPrice += product.price * qty;
    }

    // reduce stock only after every item has been validated
    for (const i of orderItems) await Product.findByIdAndUpdate(i.product, { $inc: { stock: -i.qty } });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders/mine
router.get("/mine", protect, async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

// GET /api/orders (admin: all orders)
router.get("/", protect, adminOnly, async (_req, res) => {
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
});

// PUT /api/orders/:id/status (admin)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

module.exports = router;
