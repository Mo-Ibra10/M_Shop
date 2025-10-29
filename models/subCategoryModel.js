const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        unique:[true,"subcategory must be unique"],
        minlength: [2,"to short subcategory"],
        maxlength:  [32,"to long subcategory"],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: "category",
        required: [true, "subcategory must belong to parent category"]
    },
},
{timestamps: true}
);

module.exports = mongoose.model("subcategory",subCategorySchema);