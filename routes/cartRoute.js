const express =require('express');

const authService = require('../services/authService');


const {addProductToCart , getLoggedUserCart , removeCartItem , clearCart , updateCartItemQuantity , applyCoupon} = require('../services/cartService');

const router = express.Router();

router.use(authService.protect,
authService.allowTo("user"))

//routes
router.route('/')
.post(addProductToCart)
.get(getLoggedUserCart)
.delete(clearCart)

router.put('/applyCoupon', applyCoupon)

router.route('/:itemId')
.put(updateCartItemQuantity)
.delete(removeCartItem)




module.exports = router;