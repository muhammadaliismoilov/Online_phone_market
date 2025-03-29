const BaseError = require("../error/error");

module.exports =function(error,req,res,next) {

// console.log(error);
if (error instanceof BaseError) {
    return res.status(error.status).json({message:error.message,errors:error.errors})
}
return res.status(500).json({message:"Server error"})

}