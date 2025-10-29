const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

// ✅ Add Address Validator
exports.addAddressValidator = [
  check("alias")
    .notEmpty().withMessage("Alias is required")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);
      if (user) {
        const isAliasExist = user.addresses.some(
          (addr) => addr.alias.toLowerCase() === val.toLowerCase()
        );
        if (isAliasExist) {
          throw new Error(`Address alias '${val}' already exists`);
        }
      }
      return true;
    }),

  check("details")
    .optional()
    .isLength({ min: 3 }).withMessage("Details must be at least 3 characters"),

  check("phone")
    .notEmpty().withMessage("Phone is required")
    .isNumeric().withMessage("Phone must contain only numbers")
    .isLength({ min: 6, max: 15 }).withMessage("Phone must be between 6 and 15 digits"),

  check("city")
    .notEmpty().withMessage("City is required"),

  check("postcode")
    .notEmpty().withMessage("Postcode is required"),

  validatorMiddleware,
];

// ✅ Remove Address Validator
exports.removeAddressValidator = [
  check("addressId")
    .isMongoId().withMessage("Invalid Address ID format"),
  validatorMiddleware,
];
