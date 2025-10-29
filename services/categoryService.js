/* eslint-disable node/no-missing-require */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */

const factory = require('./handlersFactory');


const sharp = require('sharp'); 

const asyncHandler = require('express-async-handler'); 

// eslint-disable-next-line import/no-extraneous-dependencies
const {v4: uuidv4} = require('uuid'); // Import UUID for unique file names
const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware');


const CategoryModel = require('../models/categoryModel');

//upload single image
exports.uploadCategoryImage = uploadSingleImage('image'); // Middleware to handle image uploads

exports.resizeImage = asyncHandler( async(req, res, next) => {
const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`; // Create a unique filename for the resized image


if (req.file) {
    await sharp(req.file.buffer).resize(600,600).toFormat('jpeg').jpeg({ quality: 90 })
.toFile(`uploads/categories/${fileName}`) // Save the resized image to the specified path
//save image in to out db
req.body.image = fileName; 
}

next();
});

//description  GET list of categories
//route        GET  /api/v1/categories
//access       public
exports.getCategories = factory.getAll(CategoryModel);

//description  GET a specific category by id
//route        GET  /api/v1/categories/:id
//access       public

exports.getCategory = factory.getOne(CategoryModel);



// description create category
//route        POST  /api/v1/categories
//access       private/Admin,manager

exports.createCategory = factory.createOne(CategoryModel);


// description Update category
//route        PUT  /api/v1/categories
//access       private/Admin,manager
exports.updateCategory = factory.updateone(CategoryModel);

// description delete category
//route        delete  /api/v1/categories/:id
//access       private/Admin

exports.deleteCategory = factory.deleteOne(CategoryModel);