# Nowhere

> A full-stack MERN clothing store — browse collections, shop by size, color and gender, and check out with PayPal.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)

**Nowhere** is a production-style e-commerce application for a clothing brand, built end to end on the MERN stack. It pairs a React 18 + Vite storefront with an Express/MongoDB REST API, and covers the full retail flow: catalog browsing with filters, guest and user carts, secure checkout, order tracking, and a dedicated admin panel for managing products, orders, and users. Authentication is handled with JWT plus email OTP verification, product imagery is stored on Cloudinary, and payments are wired through PayPal.

<p align="center">
  <img src="preview.png" alt="Nowhere preview" />
</p>

## ✨ Features

- **Storefront** — home page with featured products and new arrivals, collection pages, and rich product detail views.
- **Product filtering** — browse by collection, category, size, color, gender, and brand.
- **Cart** — persistent guest cart (via guest ID) that merges into the user account on login.
- **Checkout & orders** — shipping address capture, order creation, order confirmation, "My Orders" history, and per-order detail/tracking pages.
- **Payments** — PayPal integration (`@paypal/react-paypal-js`) with payment method and status tracked on each order.
- **Authentication** — JWT-based auth with email OTP verification on registration, OTP resend, and forgot/reset password flows via Nodemailer. OTP requests are rate-limited.
- **Admin panel** — role-protected dashboard to create, edit, and delete products, manage all orders, and manage users.
- **Image uploads** — product images uploaded to Cloudinary through Multer + streamifier.
- **Newsletter** — email subscriber capture.
- **Support pages** — About, FAQ, Contact, and Features.

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Redux Toolkit & React Redux (state management)
- React Router DOM (routing)
- Axios (API client)
- Tailwind CSS (styling)
- React Icons, React Toastify & Sonner (UI / notifications)
- `@paypal/react-paypal-js` (PayPal checkout)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`) & bcryptjs (auth)
- Nodemailer (OTP / transactional email)
- Cloudinary + Multer + streamifier (image uploads)
- express-rate-limit (abuse protection)
- CORS, dotenv

**Tooling**
- Nodemon (backend dev server)
- ESLint (linting)
- PostCSS & Autoprefixer

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [MongoDB](https://www.mongodb.com/) database (local instance or MongoDB Atlas)
- Cloudinary, PayPal, and an SMTP (Gmail) account for full functionality

### Installation

Clone the repository, then install dependencies for both apps:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Environment Variables

This project reads configuration from `.env` files. Never commit real secrets — copy the example file and fill in your own values.

**`backend/.env`**

```env
PORT=9000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (Gmail SMTP) for OTP / password reset
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

**`frontend/.env`**

```env
VITE_BACKEND_URL=http://localhost:9000
```

> The frontend uses `VITE_BACKEND_URL` to point at the backend API.

### Running Locally

Start the backend (runs on **http://localhost:9000**):

```bash
cd backend
npm run dev      # nodemon server.js
# or: npm start  # node server.js
```

Optionally seed the database with sample data:

```bash
npm run seed
```

Start the frontend (Vite dev server on **http://localhost:5173**):

```bash
cd frontend
npm run dev
```

Build the frontend for production:

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
Nowhere/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/      # Auth middleware (JWT protect / admin)
│   ├── models/          # Mongoose schemas: User, Product, Cart, Checkout, Order, Subscriber
│   ├── routes/          # REST routes: users, products, cart, checkout, orders, upload, admin
│   ├── seeder.js        # Sample data seeder
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # Layout, Product, Cart, Admin, Common (support pages)
│   │   ├── Pages/        # Home, Login, Register, Profile, Collection, Orders, Admin
│   │   ├── redux/        # Store & slices (auth, cart, products, orders, admin)
│   │   └── utils/        # Helpers (e.g. price formatting)
│   └── index.html
└── preview.png          # README preview image
```

---

<p align="center">Built by <b>Syed Ibrahim Ali</b> — Full-Stack &amp; AI Engineer</p>
