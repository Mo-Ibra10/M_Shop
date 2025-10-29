const express =require('express');
const {signUpValidator,loginValidator} = require('../utils/validators/authValidator')


const {signup,login,forgetPassword,verifypassresetCode,resetPassword} = require('../services/authService');


const router = express.Router();

//routes
router.post("/signup",signUpValidator, signup);
router.post("/login",loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifypassresetCode);
router.put("/resetPassword", resetPassword);



module.exports = router;