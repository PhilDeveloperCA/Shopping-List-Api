const {GeneralError} = require('./errors');

const handleErrors = (err,req,res,next) => {
    console.log(err);
    if(err instanceof GeneralError){
        return res.status(err.getCode()).json({
            status : 'error',
            message : err.message
        });
    }
    
    return res.status(500).json({
        status : 'error',
        message : "System Error"
    })
}

module.exports = handleErrors;