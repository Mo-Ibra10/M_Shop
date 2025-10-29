const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

//description  add address to user addresses list
//route        POST  /api/v1/addresses
//access       protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  // $addToSet => add address to user  address array
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  res.status(200).json({ status: "success"
    ,message:"address added successfully to your wishlist",
    data: user.addresses });
});

//description  remove address from user addresses list
//route        delete  /api/v1/addresses/:addressId
//access       protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  // $pull => remove productId to wishlist array if addresses id exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: {_id:req.params.addressId} } },
    { new: true }
  );
  res.status(200).json({ status: "success"
    ,message:"address removed successfully from your addresses list",
    data: user.addresses });
});

//description  get addresses list of logged user
//route        get  /api/v1/addresses
//access       protected/User

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({ status: "success", results:user.addresses.length ,data: user.addresses });
});