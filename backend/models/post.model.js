import mongoose from "mongoose";


const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EWUsers",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  }
);

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    creator : {
       type: mongoose.Schema.Types.ObjectId,
        ref: "EWUsers",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EWUsers",
      },
    ],
    comments: [commentSchema],
  }
);


const post = mongoose.model("EWpost", postSchema);

export default post;