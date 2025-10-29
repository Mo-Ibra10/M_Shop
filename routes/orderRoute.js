const express =require('express');


const {createCashOrder ,findAllOrders , filterOrderForLoggedUser ,findSpecificOrder , updateOrderToPaid , updateOrderToDelivered , checkoutSession} = require('../services/orderService');

const authService = require('../services/authService');

const router = express.Router();

//routes

router.use(authService.protect)

router.get('/checkout-session/:cartId' , authService.allowTo("user") , checkoutSession );

router.route('/:cartId').post(authService.allowTo("user") , createCashOrder );
router.get('/' , authService.allowTo("user","admin","manager"),filterOrderForLoggedUser , findAllOrders);
router.get('/:id' , findSpecificOrder);

router.put('/:id/pay' , authService.allowTo("admin","manager") , updateOrderToPaid);
router.put('/:id/deliver' , authService.allowTo("admin","manager") , updateOrderToDelivered);

module.exports = router;