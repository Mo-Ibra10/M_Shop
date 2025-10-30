# 🛍️ M-Shop — E-Commerce Backend API

A complete **E-commerce backend** built with **Node.js**, **Express**, and **MongoDB**,  
tested and documented using **Postman**.

---

## 🚀 About The Project
**M-Shop** is a production-ready backend system for e-commerce applications.  
It includes authentication, product management, order handling, coupon logic, and Stripe payment integration.

💡 **Developed entirely by Mohamed Ibrahim.**

---

## 🧠 Tech Stack
- **Runtime:** Node.js (v20.17.0)  
- **Framework:** Express.js  
- **Database:** MongoDB (via Mongoose)  
- **Authentication:** JWT + bcryptjs  
- **Payment Integration:** Stripe  
- **File Upload & Image Processing:** Multer + Sharp (for brand images)  
- **Email Service:** Nodemailer (SMTP Gmail)  
- **Environment Configuration:** dotenv  
- **Validation & Middleware:** express-validator, express-async-handler, cors, compression, morgan  
- **Utilities:** uuid, slugify  
- **Code Quality Tools:** ESLint + Prettier (Airbnb config)

---

## ⚙️ Features

### 🧍‍♂️ User & Authentication
- Signup / Login  
- Forgot Password / Reset Password / Verify Reset Code  
- JWT-based Authentication  
- Role-based Authorization (Admin & User)  
- Manage User Addresses  
- User Wishlist

### 🛒 Products & Reviews
- Categories / Subcategories / Products / Brands  
- CRUD operations for each  
- Slugified URLs  
- Product Reviews and Ratings  

### 💳 Orders & Payments
- Order creation  
- Payment integration with Stripe  
- Coupon system for discounts  

### ⚡ Other Features
- **Image upload for brands only** with Multer + Sharp (optimized image storage)  
- Request validation  
- Logging & compression for performance  
- Secure routes for admins  
- Well-structured MVC pattern  

---

## 📁 Environment Variables

To run this project, create a file named **`config.env`** in the root directory and add the following keys:

```bash
# ---------------------------
# 🌍 Basic Configuration
# ---------------------------
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000

# ---------------------------
# 🗄️ Database (MongoDB)
# ---------------------------
DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# ---------------------------
# 🔐 JWT Configuration
# ---------------------------
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES_IN=90d

# ---------------------------
# 📧 Email (Gmail SMTP Example)
# ---------------------------
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# ---------------------------
# 💳 Stripe Payment Integration
# ---------------------------
STRIPE_SECRET=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

⚡ How to Run and Install the Project

Follow these steps to set up and run the project locally 👇

1️⃣ Clone the repository
git clone https://github.com/Mo-Ibra10/M-Shop.git

2️⃣ Navigate into the project folder
cd M-Shop

3️⃣ Install all dependencies
npm install

4️⃣ Create your environment file

Add a file named config.env inside the root folder,
and copy the variables listed above.

5️⃣ Run the server in development mode
npm run start:dev


This will start the server using nodemon and automatically restart on changes.

6️⃣ Or run in production mode
npm run start

7️⃣ Test the API

Once the server is running successfully:

http://localhost:8000/api/v1


Import the Postman collection (if available) and start testing the API endpoints.

🧩 Scripts

Run the development server:

npm run start:dev


Run the production server:

npm run start

📦 Installation (Quick Summary)

Clone the repo

cd M-Shop

npm install

Create config.env

npm run start:dev

👨‍💻 Author

Developed by Mohamed Ibrahim
📧 Email: mohamed123ebrahim@gmail.com

🌐 GitHub: Mo-Ibra
