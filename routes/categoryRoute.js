const express =require('express');
// eslint-disable-next-line import/no-extraneous-dependencies

const { getCategoryValidator , createCategoryValidator, updateCategoryValidator, deleteCategoryValidator} = require('../utils/validators/categoryValidator')


const {getCategories , createCategory, getCategory, updateCategory, deleteCategory,uploadCategoryImage ,resizeImage} = require('../services/categoryService');


const subcategoriesRoute= require('./subCategoryRoute')

const authService = require('../services/authService');

const router = express.Router();

//nested route
router.use("/:categoryId/subcategories",subcategoriesRoute)

//routes
router.route('/').get(getCategories)
.post(authService.protect,
authService.allowTo("admin","manager")
,uploadCategoryImage,resizeImage,
createCategoryValidator,createCategory);

router.route('/:id').get(getCategoryValidator,getCategory)
.put(authService.protect,
authService.allowTo("admin","manager"),
    uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
.delete(authService.protect,
authService.allowTo("admin"),
    deleteCategoryValidator,deleteCategory);

module.exports = router;