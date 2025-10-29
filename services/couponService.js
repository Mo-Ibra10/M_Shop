/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */


const factory = require('./handlersFactory');

const Coupon = require('../models/couponModel');




//description  GET list of Coupons
//route        GET  /api/v1/Coupons
//access       private/admin-manager
exports.getCoupons = factory.getAll(Coupon);

//description  GET a specific Coupon by id
//route        GET  /api/v1/coupons/:id
//access       public

exports.getCoupon = factory.getOne(Coupon);



// description create coupon
//route        POST  /api/v1/coupons
//access       private

exports.createCoupon = factory.createOne(Coupon);



// description Update coupon
//route        PUT  /api/v1/coupons
//access       private
exports.updateCoupon = factory.updateone(Coupon);

// description delete coupon
//route        delete  /api/v1/coupons/:id
//access       private

exports.deleteCoupon = factory.deleteOne(Coupon);