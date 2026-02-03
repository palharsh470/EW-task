import { createUser, login } from "./controller/user.controller.js";
import express from "express";
import mongoose from "mongoose";
import { addComment, addLike, createPost, getAllPosts } from "./controller/post.controller.js";
import authorisation from "./middlewares/authmiddleware.js";
import dotenv from "dotenv";

const server = express();

dotenv.config();
server.use(express.json());

server.post("/user/create", createUser)
server.post("/user/login", login)
server.post("/post/create", authorisation, createPost)
server.post("/post/:id/like", authorisation, addLike)
server.post("/post/:id/comment", authorisation, addComment)
server.get("/posts", getAllPosts)

mongoose.connect(process.env.DB_URL).then(()=>{
server.listen(3000, ()=>{
        console.log("server started")
})
})