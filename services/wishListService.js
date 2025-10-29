const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");

//description  add product to wishlist
//route        POST  /api/v1/wishlist
//access       protected/User
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  // $addToSet => add productId to wishlist array if not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
  res.status(200).json({ status: "success"
    ,message:"product added successfully to your wishlist",
    data: user.wishlist });
});

//description  remove product from wishlist
//route        delete  /api/v1/wishlist/:productId
//access       protected/User
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  // $pull => remove productId to wishlist array if productId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  res.status(200).json({ status: "success"
    ,message:"product removed successfully to your wishlist",
    data: user.wishlist });
});

//description  get logged user  wishlist
//route        get  /api/v1/wishlist
//access       protected/User

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({ status: "success", results:user.wishlist.length ,data: user.wishlist });
});