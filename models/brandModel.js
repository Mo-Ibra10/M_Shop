const mongoose = require('mongoose');

// 1- create schema
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'brand required'],
        unique: [true,'brand must be unique'],
        minlength: [3,'too short brand name'],
        maxlength: [32,'too long brand name'],
    },

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
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl; 
    }
};


// findOne findOne and Update
brandSchema.post('init', (doc) => {
    setImageURL(doc);
}
);

//Create 
brandSchema.post('save',  (doc)=> {
    setImageURL(doc);
});

// 2 - create model
module.exports= mongoose.model("brand",brandSchema);
