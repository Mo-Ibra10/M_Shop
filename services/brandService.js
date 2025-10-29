/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const factory = require('./handlersFactory');
const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware');

const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');


exports.uploadBrandImage = uploadSingleImage('image'); // Middleware to handle image uploads

exports.resizeImage = asyncHandler( async(req, res, next) => {
const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`; // Create a unique filename for the resized image

await sharp(req.file.buffer).resize(600,600).toFormat('jpeg').jpeg({ quality: 90 })
.toFile(`uploads/brands/${fileName}`) // Save the resized image to the specified path
//save image in to out db
req.body.image = fileName; 

next();
});


//description  GET list of brands
//route        GET  /api/v1/brands
//access       public
exports.getBrands = factory.getAll(Brand);

//description  GET a specific brand by id
//route        GET  /api/v1/brands/:id
//access       public

exports.getBrand = factory.getOne(Brand);



// description create brand
//route        POST  /api/v1/brands
//access       private

exports.createBrand = factory.createOne(Brand);



// description Update brand
//route        PUT  /api/v1/brands
//access       private
exports.updateBrand = factory.updateone(Brand);

// description delete brand
//route        delete  /api/v1/brands/:id
//access       private

exports.deleteBrand = factory.deleteOne(Brand);