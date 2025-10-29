const crypto = require("crypto");

const jwt = require("jsonwebtoken")

const bcrypt = require("bcryptjs");


const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/userModel');
const createToken = require('../utils/createToken');


//description  Signup
//route        GET  /api/v1/auth/signup
//access       public

exports.signup = asyncHandler(async (req, res) => {
    //1-create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    //2-generate token
        const token =createToken(user._id);


    //3-send response
    res.status(201).json({data: user, token: token});
});

//description  login
//route        GET  /api/v1/auth/login
//access       public
exports.login = asyncHandler(async (req, res, next) => {
    // 1- check if password and email in the body 
    // 2- if user exists & check if password is correct
    //first two steps are done by the validator
    const user = await User.findOne({email: req.body.email});

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) 
        {
        return next(new ApiError("incorrect email or password", 401));
    }
    // 3- generate token
    const token =createToken(user._id);
    // 4- send response to client side
    res.status(200).json({data: user, token: token});
});
//description  makee sure user is logged in
//route        GET  /api/v1/auth/protect
//access       public
exports.protect = asyncHandler(async (req, res, next) => {
    // 1- check if token exists , if exists get it 
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        
    }
    if (!token) {
        return next(new ApiError("You are not logged in, please login to get access this route", 401));
    }
    
    // 2- verify token (no change happens,expired token)
    const decoded=jwt.verify(token, process.env.JWT_SECRET_KEY)
    // 3- check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError("The user that belong to this token does no longer exist", 401));
    }
    // 4- check if user changed password after token created
    if(currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
    
    // password change after token created (error)
    if (passChangedTimestamp > decoded.iat) {
        return next(new ApiError("User recently changed password! Please log in again", 401));
    }
}
    // 5- grant access to protected route
    req.user = currentUser;
    next();
});
//desc     Authorization user permissions
//["admin", "manager"]
exports.allowTo = (...roles)=>asyncHandler(async (req, res, next) => {
    // 1- access role
    // 2- access registered user (req.user.role)
    if(!roles.includes(req.user.role)) {
        return next(new ApiError("You are not allowed to access this route", 403));
    }
    next();

});

//description  forget password
//route        post  /api/v1/auth/forgetPassword
//access       public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // 1- Get user by email 
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError(`There is no user with this email address ${req.body.email}`, 404));
    }
    // 2- if user exists, generate hash random 6 digit and save it in the db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto.createHash("sha256").update(resetCode).digest("hex");
    //save password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for the reset code(10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.passwordResetVerified = false;

    await user.save()

    const message = `hi ${user.name},\n\n we received a request to reset the password on your E-shop Account
    ${resetCode} \n Enter this code to complete the reset\n\n thanks for helping us keep your account secure.\n thanks E-shop team`;
    // 3- send the reset code via email
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset code (valid for 10 minutes)",
            message: message
        });
    } catch (err) {
        user.passwordResetCode = undefined; // Clear the reset code if email fails
        user.passwordResetExpires = undefined; // Clear the expiration time
        user.passwordResetVerified = false; // Reset verification status
        
        await user.save();
        return next(new ApiError("There was an error sending the email. Try again later!", 500));
    }
    res.status(200).json({
        status: "success",
        message: "Reset code sent to email",
    });
})

//description  verify password reset code
//route        post  /api/v1/auth/verifyResetCode
//access       public
exports.verifypassresetCode = asyncHandler(async (req, res, next) => {
    const { resetCode } = req.body;

    // 1- Check if the code is provided and not empty
    if (typeof resetCode !== "string" || resetCode.trim() === "") {
        return next(new ApiError("Reset code is required", 400));
    }

    // 2- Hash the code
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode.trim())
        .digest("hex");

    // 3- Find the user by the code and its expiration date
    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 4- If the code is not found or expired
    if (!user) {
        return next(new ApiError("Invalid or expired password reset code", 400));
    }

    // 5- If the code is valid
    user.passwordResetVerified = true;
    await user.save();

    res.status(200).json({
        status: "success",
        message: "Reset code verified successfully",
    });
});

//description  reset password
//route        post  /api/v1/auth/resetPassword
//access       public

exports.resetPassword = asyncHandler(async (req, res, next) => {
    // get user by email
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        return next(new ApiError("There is no user with this email address", 404));
    }

    // Check if reset code was verified
    if (!user.passwordResetVerified) {
        return next(new ApiError("Reset code not verified", 400));
    }

    // Set the new password
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = false;

    await user.save();

    // Generate new token
    const token = createToken(user._id);

    res.status(200).json({  token: token });
});