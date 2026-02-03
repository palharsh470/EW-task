import user from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import errorMiddleware from "../middlewares/error.middleware.js";
export async function createUser(req, res) {
    try {

        const body = req.body;

        const hashedPass = await bcrypt.hash(body.password, 10);
        body.password = hashedPass;

        const addedUser = await user.create(body);

        const data = {
            id: addedUser._id
        }

        const token = jwt.sign(data,  process.env.jwt_secret);

        res.json({
            success: true,
            data: addedUser,
            token: token
        })
    }
    catch (err) {
        errorMiddleware(err)
    }
}

export const login = async (req, res) => {

    const body = req.body
    const email = body.email;


    try {


        const logUser = await user.findOne({
            email: email,
        })

        if (!logUser) {
            res.json({
                success: false,
                message: "User doesn't exist"
            })
            return;
        }
        console.log(body.password)
        console.log(logUser)

        const result = await bcrypt.compare(body.password, logUser.password)
        console.log(result)
        if (!result) {
            return res.json({
                success: false,
                message: "Incorrect password"
            })

        }


        const data = {
            id: logUser._id
        }
        const token = jwt.sign(data, process.env.jwt_secret)

        res.json({
            success: true,
            data: logUser,
            token: token
        })
    }
    catch (err) {
        errorMiddleware(err)
    }
}