const router = require("express").Router();
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

// GET /api/products?search=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
router.get("/", async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };
    if (category && category !== "All") filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || { createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/brands  (for filter dropdown)
router.get("/brands", async (_req, res) => res.json(await Product.distinct("brand")));

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(404).json({ message: "Product not found" });
  }
});

// Admin: create / update / delete
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = router;
