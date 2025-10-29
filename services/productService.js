/* eslint-disable import/order */
/* eslint-disable node/no-unsupported-features/es-syntax */

const factory = require('./handlersFactory');

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
// const express = require('express');

const multer = require('multer');
const ApiError = require('../utils/apiError');
const {uploadMixOfImages} = require('../middlewares/uploadImageMiddleware');
 


exports.uploadProductImage = uploadMixOfImages([{
    name: 'imageCover',
    maxCount: 1,
    }
    ,

    {
    name: 'images',
    maxCount: 5,
}
])

exports.resizeProductImages =asyncHandler( async(req, res, next) => {
    // console.log(req.files);
    //1-image processing  for imagecover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`; // Create a unique filename for the resized image

await sharp(req.files.imageCover[0].buffer)
.resize(2000,1333)
.toFormat('jpeg')
.jpeg({ quality: 95 })
.toFile(`uploads/products/${imageCoverFileName}`) // Save the resized image to the specified path
//save image in to out db
req.body.imageCover = imageCoverFileName; 
}
// 2-image processing for images
if (req.files.images) {
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (img, index) => {
      const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
      
      await sharp(img.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageName}`);

      req.body.images.push(imageName);
    })
  );
    next();
}
});

//description  GET list of products
//route        GET  /api/v1/products
//access       public
exports.getProducts = factory.getAll(Product,'Products');



//description  GET a specific product by id
//route        GET  /api/v1/products/:id
//access       public

exports.getProduct = factory.getOne(Product,'Reviews');


// description create product
//route        POST  /api/v1/products
//access       private

exports.createProduct =factory.createOne(Product);

// description Update product
//route        PUT  /api/v1/products/:id
//access       private
exports.updateProduct = factory.updateone(Product);


// description delete product
//route        delete  /api/v1/products/:id
//access       private


exports.deleteProduct = factory.deleteOne(Product);