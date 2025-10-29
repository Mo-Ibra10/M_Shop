const express =require('express');

const authService = require('../services/authService');

const { addToWishlistValidation , removeFromWishlistValidation , getWishlistValidation} = require('../utils/validators/wishListValidator');

const {addProductToWishList,removeProductFromWishList , getLoggedUserWishlist} = require('../services/wishListService');

const router = express.Router();

router.use(authService.protect,
authService.allowTo("user"))

//routes
router.route('/')
.post(addToWishlistValidation,addProductToWishList)
.get(getWishlistValidation,getLoggedUserWishlist)

router.delete('/:productId',removeFromWishlistValidation,removeProductFromWishList)



module.exports = router;