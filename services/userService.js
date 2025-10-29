/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const factory = require('./handlersFactory');
const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware');

const bcrypt = require('bcryptjs');

const ApiError = require('../utils/apiError');

const createToken = require('../utils/createToken');

const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');


exports.uploadUserImage = uploadSingleImage('profileImg'); // Middleware to handle image uploads

exports.resizeImage = asyncHandler( async(req, res, next) => {
const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`; // Create a unique filename for the resized image
if(req.file){
await sharp(req.file.buffer).resize(600,600).toFormat('jpeg').jpeg({ quality: 90 })
.toFile(`uploads/users/${fileName}`) // Save the resized image to the specified path

//save image in to out db

req.body.profileImg = fileName; 
}


next();
});


//description  GET list of users
//route        GET  /api/v1/users
//access       private/Admin
exports.getUsers = factory.getAll(User);

//description  GET a specific user by id
//route        GET  /api/v1/users/:id
//access       private/Admin

exports.getUser = factory.getOne(User);



// description create user
//route        POST  /api/v1/users
//access       private/Admin

exports.createUser = factory.createOne(User);



// description Update user
//route        PUT  /api/v1/users
//access       private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
    
            req.params.id,
            {
                name: req.body.name,
                slug: req.body.slug,
                phone: req.body.phone,
                email: req.body.email,
                profileImg: req.body.profileImg,
                role: req.body.role,
            },
            {new: true}
        );
    
        if(!document){
            return next(new ApiError(`no document for this id ${req.params.id} `,404));
        }
        res.status(200).json({data: document});
})

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
    
            req.params.id,
            {
                password: await bcrypt.hash(req.body.password, 12),
                passwordChangedAt: Date.now(),
            },
            {new: true}
        );
    
        if(!document){
            return next(new ApiError(`no document for this id ${req.params.id} `,404));
        }
        res.status(200).json({data: document});
})

// description delete user
//route        delete  /api/v1/users/:id
//access       private/Admin

exports.deleteUser = factory.deleteOne(User);

// description get logged user data
//route        get  /api/v1/users/getMe
//access       private/protect
exports.getLoggegUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id; // Set the user ID to the logged-in user's ID
    next();
});

// description update logged user password
//route        get  /api/v1/users/updateMyPassword
//access       private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1 - update user password based on user payload(req.user._id)
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
        password: await bcrypt.hash(req.body.password, 12), 
        passwordChangedAt: Date.now()
    },
        { new: true}
    );
    //generate token
    const token = createToken(user._id);
    res.status(200).json({
        
        data: {
            user: user
        },
        token: token,
    });
})

// description update logged user data (without password , role)
//route        get  /api/v1/users/updateMe
//access       private/protect

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,},
    {new: true}
)
res.status(200).json({
    status: 'success',
    data : {
        user: updatedUser
    }
});

});

// description Deactived logged user data (without password , role)
//route        DELETE  /api/v1/users/deleteMe
//access       private/protect

exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {active: false},
    )
    res.status(204).json({
        status: 'success'
    });
});