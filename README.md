# Petalry: MERN cosmetics e-commerce store

A full-stack e-commerce app: product listings, search, filtering, cart, authentication, product management and order processing, all through REST APIs backed by MongoDB.

## Tech stack
- **MongoDB** with Mongoose (users, products, orders)
- **Express.js + Node.js** REST API, JWT auth, bcrypt password hashing
- **React 18** (Vite) with React Router and Context API for auth and cart

## Setup
Requirements: Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. API
cd server
npm install
cp .env.example .env      # then edit MONGO_URI and JWT_SECRET
npm run seed              # 14 sample products + demo users
npm run dev               # http://localhost:5000

# 2. Client (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

Demo logins created by the seed script:
- Admin: `admin@store.com` / `admin123`
- Customer: `user@store.com` / `user1234`

## Folder structure
```
server/
  config/db.js            MongoDB connection
  models/                 User, Product, Order schemas
  middleware/auth.js      protect (JWT) and adminOnly
  routes/                 auth, products, orders
  seed.js                 sample data
  server.js               app entry
client/src/
  api.js                  fetch wrapper + currency helper
  context/                AuthContext, CartContext
  components/             Navbar, ProductCard, ProtectedRoute
  pages/                  Shop, ProductDetail, Cart, Auth, Orders, Admin
```

## REST API
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /api/auth/register | public | Create customer account |
| POST | /api/auth/login | public | Log in, returns JWT |
| GET | /api/auth/me | user | Current user |
| GET | /api/products | public | List with `search`, `category`, `brand`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` |
| GET | /api/products/brands | public | Distinct brands |
| GET | /api/products/:id | public | Single product |
| POST / PUT / DELETE | /api/products(/:id) | admin | Manage products |
| POST | /api/orders | user | Place order (server recalculates prices, checks and reduces stock) |
| GET | /api/orders/mine | user | My orders |
| GET | /api/orders | admin | All orders |
| PUT | /api/orders/:id/status | admin | Update order status |

## Data models
- **User**: name, email (unique), hashed password, role (`customer` or `admin`)
- **Product**: name, brand, category, description, price, image, stock, rating
- **Order**: user, items (product, name, price, qty), shippingAddress, paymentMethod, totalPrice, status

## Ideas to extend
Reviews and ratings, wishlist, coupon codes, Razorpay or Stripe payments, image upload with Cloudinary, email confirmations.
