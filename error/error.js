module.exports = class BaseError extends Error{
    status
    errors
    constructor(status,message,errors){
        super(message)
    }

    static BedRequest (status,message,errors = []){
        return new BaseError (status,message,errors)
    }
    // static 








}

