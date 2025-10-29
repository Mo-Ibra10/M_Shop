const slugify = require('slugify');
const {  check,body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware')

exports.getSubCategoryValidator = [
    //1-rules
    check('id').isMongoId().withMessage('invalid subcategory id format'),
    
    validatorMiddleware,
];

exports.createSubCategoryValidator = [
    check("name").notEmpty()
    .withMessage('subcategory required')
    .isLength({min: 2})
    .withMessage("too short subcategory name")
    .isLength({max: 32})
    .withMessage("too long subcategory name")
    .custom((val, {req}) => {
        req.body.slug = slugify(val);
        return true;
    }),
    check('category').notEmpty().withMessage('subcategory must be belong to category')
    .isMongoId().withMessage('invalid category id format'),
    validatorMiddleware,
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().withMessage('invalid subcategory id format'),
    body("name").custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('invalid subcategory id format'),
    validatorMiddleware,
]
