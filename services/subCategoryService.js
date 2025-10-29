
const factory = require('./handlersFactory');


const SubCategory = require('../models/subCategoryModel');

exports.setCategoryIdToBody = (req,res,next)=>{
    //nested route create
    if(!req.body.category){req.body.category=req.params.categoryId};
    next();

}

// description create subCategory
//route        POST  /api/v1/subCategories
//access       private

exports.createSubCategory = factory.createOne(SubCategory);

//Nested route get
//GET /api/v1/categories/:categoryId/subcategpries

exports.createFilterObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.categoryId) filterObject = {category: req.params.categoryId};
    req.filterObj= filterObject;
    next()
}

//description  GET list of subcategories
//route        GET  /api/v1/subcategories
//access       public
exports.getSubCategories = factory.getAll(SubCategory);

//description  GET a specific subcategory by id
//route        GET  /api/v1/subcategory/:id
//access       public

exports.getSubCategory = factory.getOne(SubCategory);


// description Update subcategory
//route        PUT  /api/v1/subcategory
//access       private
exports.updateSubCategory = factory.updateone(SubCategory);

// description delete subcategory
//route        delete  /api/v1/subcategory/:id
//access       private

exports.deleteSubCategory = factory.deleteOne(SubCategory);