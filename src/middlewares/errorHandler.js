// centralized error handling middleware


const errorHandler = (err,req, res,next)=>{
    console.log(err.stsck);
    res.status(500).json({
        status:5000,
        message: err.message || "Internal Server Error",
        error: err.message || "Internal Server Error"
    });
}

export default errorHandler;