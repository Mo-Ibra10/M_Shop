const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const calculateTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity;
    });
    cart.totalPriceAfterDiscount = undefined; // reset previous discount if cart is updated
    return totalPrice;
}

//description  Add  products to cart
//route        POST  /api/v1/cart
//access       private/user

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ApiError('Product not found', 404));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{
        product: productId,
        color,
        price: product.price,
        quantity: 1,
      }],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += 1;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
        quantity: 1,
      });
    }
  }

  const totalPrice = calculateTotalCartPrice(cart);
  cart.totalCartPrice = Number.isNaN(totalPrice) ? 0 : totalPrice;

  await cart.save();

  res.status(200).json({
    status: 'success',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
    message: 'Product added to cart successfully',
  });
});

//description  GET  logged user cart
//route        GET  /api/v1/cart
//access       private/user
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`There is no cart for this user id ${req.user._id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });

})

//description  Remove specific cart item
//route        Deleta  /api/v1/cart/:itemId
//access       private/user
exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );

  if (!cart) {
    return next(new ApiError('Cart not found', 404));
  }

  const totalPrice = calculateTotalCartPrice(cart);
  cart.totalCartPrice = Number.isNaN(totalPrice) ? 0 : totalPrice;

  await cart.save();

  res.status(200).json({
    status: 'success',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//description  clear logged user cart
//route        Deleta  /api/v1/cart
//access       private/user

exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

//description  Update specific cart item
//route        put  /api/v1/cart/:itemId
//access       private/user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for this user ${req.user._id}`, 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  }else {
    return next(new ApiError(`there is no item for this id :${req.params.itemId}`, 404));
  }

  const totalPrice = calculateTotalCartPrice(cart);
  cart.totalCartPrice = Number.isNaN(totalPrice) ? 0 : totalPrice;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numberOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//description  Apply coupon to logged user cart
//route        put  /api/v1/cart/:itemId
//access       private/user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1- get coupon based on coupon name
  const coupon = await Coupon.findOne({ 
    name: req.body.coupon , 
    expire: { $gt: Date.now() } 
  });
  if (!coupon) {
    return next(new ApiError('Coupon is invalid or expired', 400));
  }
  // 2- get logged user cart to get total price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = calculateTotalCartPrice(cart);
  // 3- calculate price after apply priceAfterDiscount
  const totalPriceAfterDiscount = (totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2);
  cart.totalCartPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});