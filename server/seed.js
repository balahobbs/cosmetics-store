require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Product = require("./models/Product");

const img = (t) => `https://placehold.co/600x600/F3E4E8/6B2A3E?text=${encodeURIComponent(t)}`;

const products = [
  ["Hydra Dew Moisturiser", "Lumen", "Skincare", 749, 40, 4.6, "Lightweight gel cream with hyaluronic acid for 24-hour hydration."],
  ["Vitamin C Brightening Serum", "Lumen", "Skincare", 999, 25, 4.7, "10% vitamin C serum that evens skin tone in 4 weeks."],
  ["Gentle Foam Cleanser", "Petal & Pine", "Skincare", 399, 60, 4.3, "Sulfate-free daily cleanser for sensitive skin."],
  ["SPF 50 Sheer Sunscreen", "Petal & Pine", "Skincare", 549, 50, 4.5, "No white cast, no sticky finish."],
  ["Velvet Matte Lipstick", "Rouge Atelier", "Makeup", 649, 80, 4.4, "Highly pigmented matte lipstick in Brick Rose."],
  ["Skin-Tint Foundation", "Rouge Atelier", "Makeup", 899, 35, 4.2, "Medium-coverage, natural finish, 12 shades."],
  ["Volume Lash Mascara", "Rouge Atelier", "Makeup", 499, 70, 4.1, "Smudge-proof mascara that lifts and separates."],
  ["Cream Blush Duo", "Lumen", "Makeup", 599, 45, 4.5, "Blendable cream blush for a natural flush."],
  ["Argan Repair Hair Oil", "Roots & Co", "Haircare", 459, 55, 4.4, "Smooths frizz and adds shine without weight."],
  ["Anti-Dandruff Shampoo", "Roots & Co", "Haircare", 349, 90, 4.0, "Zinc pyrithione formula for a calm scalp."],
  ["Amber & Fig Eau de Parfum", "Maison Dusk", "Fragrance", 1799, 20, 4.8, "Warm, woody fragrance with fig and amber."],
  ["Rose Water Body Mist", "Maison Dusk", "Fragrance", 599, 65, 4.3, "Light daily mist with Damask rose."],
  ["Shea Body Butter", "Petal & Pine", "Bath & Body", 649, 40, 4.6, "Rich whipped butter for dry skin."],
  ["Oat Milk Bath Soak", "Petal & Pine", "Bath & Body", 399, 30, 4.2, "Calming bath soak with colloidal oats."],
].map(([name, brand, category, price, stock, rating, description]) => ({
  name, brand, category, price, stock, rating, description, image: img(name),
}));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([Product.deleteMany(), User.deleteMany()]);
  await Product.insertMany(products);
  await User.create({ name: "Admin", email: "admin@store.com", password: "admin123", role: "admin" });
  await User.create({ name: "Demo Customer", email: "user@store.com", password: "user1234" });
  console.log("Seeded: 14 products, admin@store.com / admin123, user@store.com / user1234");
  process.exit(0);
})();
