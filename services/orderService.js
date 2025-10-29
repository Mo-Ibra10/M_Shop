const stripe = require('stripe')(process.env.STRIPE_SECRET);
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');

const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const ApiError = require('../utils/apiError');

const Order = require('../models/orderModel');
const User = require('../models/userModel');
//description  create cash order
//route        POST  /api/v1/orders/cartId
//access       private/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
    //app settings
    const taxPrice = 0;
    const shippingPrice = 0;
    //1- get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
        return next(new ApiError(`there is no cart for this Id ${req.params.cartId}`, 404));
    }
    //2- get order price depend on cart price (check if coupon applied or not)
    const cartPrice = cart.totalCartPriceAfterDiscount
        ? cart.totalCartPriceAfterDiscount
        : cart.totalCartPrice;
        
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    //3- create order with default payment method cash
        const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,

    });
    //4- after creating order, decrement product quantity, increment sold product

    if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
    }));
    await Product.bulkWrite(bulkOption , {});

    //5- clear cart depend on cartId
    await Cart.findByIdAndDelete(req.params.cartId);
    }
    res.status(201).json({
        status: 'success',
        data: order,
    });
});
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    //if user not admin
    if (req.user.role === 'user') req.filterObj = { user: req.user._id };
    next();
    
});
//description  Get all order
//route        POST  /api/v1/orders
//access       private/user-admin- manager

exports.findAllOrders = factory.getAll(Order);

//description  Get all order
//route        POST  /api/v1/orders
//access       private/user-admin- manager

exports.findSpecificOrder = factory.getOne(Order);

//description  update order paid status to paid
//route        PUT  /api/v1/orders/:id/pay
//access       private/admin- manager

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id);
    if (!order) {
        return next(new ApiError(`there is no order for this Id ${req.params.id}`, 404));
    }

    //update order to paid
    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        status: 'success',
        data: updatedOrder,
    });
});

//description  update order delivered status to delivered
//route        PUT  /api/v1/orders/:id/deliver
//access       private/admin- manager

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id);
    if (!order) {
        return next(new ApiError(`there is no order for this Id ${req.params.id}`, 404));
    }
    //update order to delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        status: 'success',
        data: updatedOrder,
    });
});

//description  get checkout session from stripe and send it as response
//route        GET  /api/v1/orders/checkout-session/:cartId
//access       protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // App settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1- Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError(`There is no cart with Id ${req.params.cartId}`, 404));
  }

  // 2- Get order price depend on cart price (check if coupon applied or not)
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3- Create Stripe checkout session (✅ compatible with new API)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: req.user.name, // ممكن تحط اسم المنتج أو المستخدم هنا
            description: 'Order from our store',
          },
          unit_amount: Math.round(totalOrderPrice * 100), // السعر بالسنت (Stripe بياخد العملة مقسومة على 100)
        },
        quantity: 1,
      },
    ],
    success_url: `${req.protocol}://${req.get('host')}/orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4- Send session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

const createOrderCheckout = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const card = await Cart.findById(cartId);
    const user = await User.findOne({ email: session.customer_email });

    // create order
    const order = await Order.create({
        user: user._id,
        cartItems: card.cartItems,
        shippingAddress,
        totalOrderPrice: orderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    });
    // after creating order, decrement product quantity, increment sold product
        if (order) {
    const bulkOption = Cart.cartItems.map((item) => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
        },
    }));
    await Product.bulkWrite(bulkOption , {});
    //5- clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
    }
}
//description  this webhook well run where stripe  payment success paid
//route        post  /webhook-checkout
//access       protected/user

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
      //create order
      createOrderCheckout(event.data.object);
    }
    res.status(200).json({ received: true });
});