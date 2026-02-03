export default function errorMiddleware(err, req, res, next){
    res.json({
        success : false,
        message : err.message || "Something went wrong"
    })
}