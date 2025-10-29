const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        cartItems: [{
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: Number,
            price: Number,
            color: String,
        }],
        totalCartPrice: Number,
        totalCartPriceAfterDiscount: Number,
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    },
    {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);