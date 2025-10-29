const {  check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

const User = require('../../models/userModel');


exports.signUpValidator = [
    check("name").notEmpty()
    .withMessage('User required')
    .isLength({min: 3})
    .withMessage("too short User name")
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    }),

    check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address").custom((val) =>User.findOne({email:val}).then(user => {
        if (user) {
            return Promise.reject(new Error('Email already in use'));
        }
    })),

    check("password")
    .notEmpty().withMessage("Password required")
    .isLength({min: 6}).withMessage("Password must be at least 6 characters ")
    .custom((password, {req}) => {
        if (password !== req.body.passwordConfirm) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),

    check("passwordConfirm")
    .notEmpty().withMessage("Password confirmation required"),

    check("phone").optional().isMobilePhone(["ar-EG","ar-SA"])
    .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),

    check("profileImg").optional(),

    check("role")
    .optional(),
    
    validatorMiddleware,
];


exports.loginValidator = [

    check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),


    check("password")
    .notEmpty().withMessage("Password required")
    .isLength({min: 6}).withMessage("Password must be at least 6 characters "),
    

    
    validatorMiddleware,
];
