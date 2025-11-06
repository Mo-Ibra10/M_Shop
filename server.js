const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

dotenv.config({ path: 'config.env' });

const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware')
const dbConnection = require('./config/database');
// routes
const mountRoutes = require('./routes');
const { webhookCheckout } = require('./services/orderService');
//const categoryRoute = require('./routes/categoryRoute');
//const subCategoryRoute = require('./routes/subCategoryRoute');
//const brandRoute = require('./routes/brandRoute');
//const productRoute = require('./routes/productRoute');
//const userRoute = require('./routes/userRoute');
//const authRoute = require('./routes/authRoute');
//const reviewRoute = require('./routes/reviewRoute');
//const wishListRoute = require('./routes/wishListRoute');
//const addressRoute = require('./routes/addressRoute');
//const couponRoute = require('./routes/couponRoute');


// Connect to database
dbConnection();

// Express app
const app = express();
// enable other domains to access my aplication 
app.use(cors());
app.options(/.*/, cors()); // ✅ يقبل أي مسار
//compress all responses
app.use(compression());

//checkout webhook
app.post('/webhook-checkout',express.raw({type:'application/json'}),webhookCheckout);


// Middlewares
app.use(express.json({ limit: '20kb' }));

app.use(express.static(path.join(__dirname, 'uploads')));


if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"));
    console.log(`node : ${process.env.NODE_ENV}`);
}

// Limit each IP to max 100 requests per window (here, per 15 minutes)
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 1 hours'
});
app.use( "/api",limiter); //  apply to all requests that begin with /api

// Routes
mountRoutes(app);
//app.use('/api/v1/categories', categoryRoute);
//app.use('/api/v1/subcategories', subCategoryRoute);
//app.use('/api/v1/brands', brandRoute);
//app.use('/api/v1/products', productRoute);
//app.use('/api/v1/users', userRoute);
//app.use('/api/v1/auth', authRoute);
//app.use('/api/v1/reviews', reviewRoute);
//app.use('/api/v1/wishlist', wishListRoute);
//app.use('/api/v1/addresses', addressRoute);
//app.use('/api/v1/coupons', couponRoute);


// Handle unmatched routes
// app.all('*', (req, res, next) => {
//     const err = new Error(`Cannot handle URL: ${req.originalUrl}`);
//     next(err); 
// });

app.use((req, res, next) => {
    // const err = new Error(`Cannot handle URL: ${req.originalUrl}`);
    // err.status = 404;
    next(new ApiError(`Cannot handle URL: ${req.originalUrl}`,400)); 
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;

// ✅ تأكد إنك حاطط ده قبل listen
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// ✅ handle unhandled rejections (زي ما عندك)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Error : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
