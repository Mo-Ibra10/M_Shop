/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */


const factory = require('./handlersFactory');

const Review = require('../models/reviewModel');


//Nested route get
//GET /api/v1/products/:productId/reviews

exports.createFilterObj = (req,res,next)=>{
    let filterObject = {};
    if(req.params.productId) filterObject = {product: req.params.productId};
    req.filterObj= filterObject;
    next()
}

//description  GET list of reviews
//route        GET  /api/v1/reviews
//access       public
exports.getReviews = factory.getAll(Review);

//description  GET a review brand by id
//route        GET  /api/v1/reviews/:id
//access       public

exports.getReview = factory.getOne(Review);

//nested route create
exports.setProductIdAndUserIdToBody = (req,res,next)=>{
    
    if(!req.body.product){req.body.product=req.params.productId};
    if(!req.body.user){req.body.user=req.user._id};
    next();

}



// description create review
//route        POST  /api/v1/reviews
//access       private/protect/user

exports.createReview = factory.createOne(Review);



// description Update review
//route        PUT  /api/v1/reviews
//access       private/protect/user
exports.updateReview = factory.updateone(Review);

// description delete review
//route        delete  /api/v1/reviews/:id
//access       private/protect/user-admin-manager

exports.deleteReview = factory.deleteOne(Review);