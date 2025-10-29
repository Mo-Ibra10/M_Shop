/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"name required"],
        trim: true,
        minlength: 3,
        maxlength: 50
    },
    slug: {
        type: String,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true,"email required"],
        unique: true,
        lowercase: true,
    },
    phone:String,
    profileImg: String,

    password: {
        type: String,
        required: [true,"password required"],
        minlength: [6,"Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: {
        type: Boolean
    },
    role: {
        type: String,
        enum: ["user", "admin","manager"],
        default: "user"
    },
    active: {
        type:Boolean,
        default: true
    },
    //child reference one to many
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    addresses: [{
        id: {type: mongoose.Schema.Types.ObjectId},
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    }]
}, {timestamps:true});


userSchema.pre('save',async function(next) {
    if (!this.isModified('password')) return next();
    //hashing user password
    this.password =await bcrypt.hash(this.password, 12);
    next();
});


const User = mongoose.model("User", userSchema);

module.exports = User;