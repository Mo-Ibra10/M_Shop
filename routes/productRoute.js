const express =require('express');
const { getProductValidator , createProductValidator, updateProductValidator, deleteProductValidator} = require('../utils/validators/productValidator')


const {getProduct , getProducts, updateProduct, createProduct, deleteProduct,uploadProductImage,resizeProductImages} = require('../services/productService');

const authService = require('../services/authService');
const reviewsRoute= require('./reviewRoute')

const router = express.Router();

//nest review router
// post /api/v1/products/:1244ddssddf/reviews
// get /api/v1/products/:1244ddssddf/reviews
// get /api/v1/products/:1244ddssddf/reviews/1234dddss
router.use("/:productId/reviews",reviewsRoute)


//routes
router.route('/').get(getProducts)
.post(authService.protect,authService.allowTo("admin","manager"),
    uploadProductImage,resizeProductImages,createProductValidator,createProduct);

router.route('/:id').get(getProductValidator,getProduct)
.put(authService.protect,authService.allowTo("admin","manager"),
    uploadProductImage,resizeProductImages,updateProductValidator,updateProduct)
.delete(authService.protect,authService.allowTo("admin"),
    deleteProductValidator,deleteProduct);

module.exports = router;