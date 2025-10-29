// validations/wishlistValidation.js

const { check } = require("express-validator");
const Product = require("../../models/productModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.addToWishlistValidation = [
   check("productId")
    .trim()
    .notEmpty().withMessage("Product ID is required")
    .bail() // يوقف بقية الفاليديشن لو الشرط اللي قبله فشل
    .isMongoId().withMessage("Product ID must be a valid MongoDB ObjectId")
    .bail()
    .custom(async (id) => {
      const exists = await Product.exists({ _id: id });
      if (!exists) {
        throw new Error("Product not found or not a product id");
      }
      return true;
    }),
    
    validatorMiddleware,

];

exports.removeFromWishlistValidation = [
    check('productId').isMongoId().withMessage('invalid category id format'),
    validatorMiddleware,] 
    

exports.getWishlistValidation = [
    check('productId').isMongoId().withMessage('invalid category id format'),
    validatorMiddleware,]

