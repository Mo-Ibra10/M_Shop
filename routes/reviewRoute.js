const express =require('express');
// const { getBrandValidator , createBrandValidator, updateBrandValidator, deleteBrandValidator} = require('../utils/validators/brandValidator')

const {getReviewValidator, createReviewValidator,
    updateReviewValidator, deleteReviewValidator

} = require('../utils/validators/reviewValidator');
const {getReview,getReviews,createReview,
    deleteReview,
    updateReview,createFilterObj,
    setProductIdAndUserIdToBody} = require('../services/reviewService');

const authService = require('../services/authService');

const router = express.Router({mergeParams:true});

//routes
router.route('/').get(createFilterObj,getReviews)
.post(authService.protect,authService.allowTo("user"),
setProductIdAndUserIdToBody,createReviewValidator,createReview);

router.route('/:id').get(getReviewValidator,getReview)
.put(authService.protect,authService.allowTo("user"),updateReviewValidator,updateReview)
.delete(authService.protect,authService.allowTo("admin","manager","user"),deleteReviewValidator,deleteReview);

module.exports = router;