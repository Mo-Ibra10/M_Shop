const mongoose = require('mongoose');

// 1- create schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'category required'],
        unique: [true,'category must be unique'],
        minlength: [3,'too short category name'],
        maxlength: [32,'too long category name'],
    },

    // A and B => shoping.com/a-and-b دى بتحط مكان اى كاتيجورى فيها مسافات تحط مكانها سلاش 
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
    
    // timestamps create two fieldes in my database
},
{timestamps: true}
);

const setImageURL = (doc) => {
    //return set image base url +image name
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
        doc.image = imageUrl; 
    }
};


// findOne findOne and Update
categorySchema.post('init', (doc) => {
    setImageURL(doc);
}
);

//Create 
categorySchema.post('save',  (doc)=> {
    setImageURL(doc);
});

// 2 - create model
const CategoryModel = mongoose.model("category",categorySchema);

module.exports = CategoryModel;