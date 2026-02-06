import errorMiddleware from "../middlewares/error.middleware.js";
import post from "../models/post.model.js";

export async function createPost(req, res) {
    try {

        const body = req.body;
        const user = req.user;

        if (!body.text.trim() && !body.image) {
            return res.json({
                success: false,
                message: "All fields are required"
            })
        }

        body.text = body.text.trim()
        body.creator = user._id

        console.log(body)
        const newPost = await post.create(body)

        console.log(newPost)

        res.json({
            success: true,
            data: newPost
        })

    } catch (err) {
        errorMiddleware(err)
    }

}

export async function getAllPosts(req, res) {
    try {

        const posts = await post.find()
            .populate("creator", "username")
            .lean();

        const postsWithLikeCount = posts.map(post => ({
            ...post,
            likesCount: post.likes.length,
            commentCount: post.comments.length

        }));


        res.json({
            success: true,
            data: postsWithLikeCount
        })
    }
    catch (err) {

        errorMiddleware(err)
    }


}



export async function addLike(req, res) {
    try {
        const userId = req.user._id;
        const postId = req.params.id;


        const postToLike = await post.findById(postId);
        if (!postToLike)
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });

        const isLiked = postToLike.likes.includes(userId);

        console.log(isLiked)
        if (isLiked) {
            postToLike.likes.pull(userId);
        } else {
            postToLike.likes.push(userId);
        }

        await postToLike.save();

        res.json({
            success: true,
            likesCount: postToLike.likes.length,
            liked: !isLiked,
        });
    } catch (err) {
        errorMiddleware(err);
    }
}



export async function addComment(req, res) {

    try {
        const { text } = req.body;
        const userId = req.user._id;

        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment text required"
            });
        }

        const postToComment = await post.findById(req.params.id);
        if (!postToComment)
            return res.status(404).json({ success: false, message: "Post not found" });

        postToComment.comments.push({
            user: userId,
            text,
        });

        await postToComment.save();

        res.status(201).json({
            success: true,
            comments: postToComment.comments,
            commentsCount : postToComment?.comments?.length
        });
    } catch (err) {
        errorMiddleware(err)
    }
}