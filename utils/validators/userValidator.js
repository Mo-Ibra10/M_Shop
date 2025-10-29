const {  check, body } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

const User = require('../../models/userModel');
// eslint-disable-next-line import/order
const bcrypt = require('bcryptjs');

exports.getUserValidator = [
    //1-rules
    check('id').isMongoId().withMessage('invalid brand id format'),
    validatorMiddleware,
];

exports.createUserValidator = [
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

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('invalid User id format'),
    body("name").optional().custom((val, {req}) => {
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

    check("phone").optional().isMobilePhone(["ar-EG","ar-SA"])
    .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),

    check("profileImg").optional(),

    check("role")
    .optional(),

    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check('id').isMongoId().withMessage('invalid User id format'),
    body("currentPassword").notEmpty()
    .withMessage("you must enter your current password"),

    body("passwordConfirm").notEmpty()
    .withMessage("you must enter your password confirm"),

    body("password").notEmpty().withMessage("you must enter your new password")
    .custom(async (val, {req}) => {
        //1-verify current password
        const user = await User.findById(req.params.id);
        if(!user){
            throw new Error("there is no user for this id");
        }
        const isCorrectPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if(!isCorrectPassword){
            throw new Error("incorrect current password");
        }
        //2-verify new password and confirm password
        if(val !== req.body.passwordConfirm){
            throw new Error("password confirmation incorrect");
        }
        return true;
    }),
    validatorMiddleware,
]

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('invalid User id format'),
    validatorMiddleware,
]


exports.updateLoggedUserValidator = [
    body("name").optional().custom((val, {req}) => {
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

    check("phone").optional().isMobilePhone(["ar-EG","ar-SA"])
    .withMessage('Invalid phone number only accepted Egy and SA phone numbers'),

    check("profileImg").optional(),



    validatorMiddleware,
];