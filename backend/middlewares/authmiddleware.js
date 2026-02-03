import jwt from "jsonwebtoken"
import user from "../models/user.model.js"
import errorMiddleware from "./error.middleware.js";
export default async function authorisation(req, res, next) {

    try {

        const token = req.body.token

        const tokenData = jwt.verify(token,process.env.jwt_secret)

        const tokenId = tokenData.id;
        const loggedUser = await user.findById(tokenId);

        if (!loggedUser) {
            return res.json({
                success: false,
                message: "User not exist"
            })
        }

        req.user = loggedUser
        next()
    }
    catch (err) {
        errorMiddleware(err)
    }
}