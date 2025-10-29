const express =require('express');

const {createSubCategory, getSubCategories, getSubCategory, deleteSubCategory, updateSubCategory, setCategoryIdToBody, createFilterObj} = require('../services/subCategoryService');
const {createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator} =require('../utils/validators/subCategoryValidator')

const authService = require('../services/authService');
//mergeParams: allow us to access parameters on other routers
//ex: we need to access categoryId from category router
const router = express.Router({mergeParams: true});

router.route('/')
.post(authService.protect,authService.allowTo("admin","manager"),
    setCategoryIdToBody,createSubCategoryValidator,createSubCategory)
.get(createFilterObj,getSubCategories);

router.route('/:id')
.get(getSubCategoryValidator,getSubCategory)
.put(authService.protect,authService.allowTo("admin","manager"),
    updateSubCategoryValidator,updateSubCategory)
.delete(authService.protect,authService.allowTo("admin"),
    deleteSubCategoryValidator,deleteSubCategory);

module.exports=router;