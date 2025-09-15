import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    comment: [{ user: { type: mongoose.Types.ObjectId, ref: "User" }, text: String }],
    user: { type: mongoose.Types.ObjectId, ref: "User" },
}, { timestamps: true })

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;