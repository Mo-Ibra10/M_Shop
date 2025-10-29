const ApiError = require("../utils/apiError");

const handleJwtInvaledSignature = ()=> new ApiError(
    "Invalid token please login again...",401)

const handleJwtExpired = () => new ApiError(
    "Your token has expired, please login again...",401)

const globalError = (err, req, res, next) => {
    err.statuscode = err.statuscode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === "development"){
        sendErrorForDev(err,res);
    }else{
        if(err.name==="JsonWebTokenError") err= handleJwtInvaledSignature()
        if(err.name==="TokenExpiredError") err= handleJwtExpired()
        sendErrorForProd(err,res)
    }
};

const sendErrorForDev =(err,res)=>{
    res.status(err.statuscode).json({ 
        status :err.status ,
        error : err,
        message: err.message,
        stack: err.stack,

    });
};

const sendErrorForProd =(err,res)=>{
    res.status(err.statuscode).json({ 
        status :err.status ,
        message: err.message,

    });
}

module.exports =globalError;