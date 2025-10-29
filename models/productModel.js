/* eslint-disable no-undef */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true],
        trim:true,
        mimlength:[3,'too short product title'],
        maxLength:[3300,'too long product title'],
    },
    slug:{
        type:String,
        required:true,
        lowercase:true,    
    },
    description:{
        type:String,
        required:[true,'product description is required'],
        trim:true,
        minLength:[20,'too short product description'],
        maxLength:[2000,'too long product description'],
    },
    quantity:{
        type:Number,
        required:[true,'product quantity is required'],
    },
    sold:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        required:[true,'product price is required'],
        trim:true,
        max:[200000,'too long product price'],
    },
    priceAfterDiscount:{
        type:Number,
    },
    color:{
        type:String,
    },
    imageCover:{
        type:String,
        required:[true,'product image is required'],
    },
    images:[String],
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:[true,'product must belong to a category'],
    },
    subCategory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        required:[true,'product must belong to a subcategory'],
    }
],
    brand:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Brand',
    },
    ratingsAverage:{
        type:Number,
        min:[1,'rating must be above or equal 1'],
        max:[5,'rating must be below or equal 5'],
    },
    totalRating:{
        type:Number,
        default:0,
    },
ratingsquantity:{
        type:Number,
        default:0,
    },
reviews:[{
    type:mongoose.Schema.Types.ObjectId,}]

}, {timestamps: true,
    //to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('Reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});
//mongoose query middleware
productSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'category',
        select: 'name-_id'
    });
    next();
});

const setImageURL = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl; 
    }

    if (doc.images && Array.isArray(doc.images)) {
        const imagesList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        doc.images = imagesList;
    }
};



// findOne findOne and Update
productSchema.post('init', (doc) => {
    setImageURL(doc);
}
);

//Create 
productSchema.post('save',  (doc)=> {
    setImageURL(doc);
});

module.exports = mongoose.model('Product', productSchema);