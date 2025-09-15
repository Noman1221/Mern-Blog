import Blog from "../model/blog.model.js";

export const createBlog = async (req, res) => {
    let userId = req.user.id;
    let { title, description, image, } = req.body;
    if (!title || !description || !image) return res.status(400).json({ message: "missing details" })
    const newBlog = new Blog({
        title, description, image, user: userId
    });
    await newBlog.save();
    res.status(201).json({ message: "blog created", blog: newBlog })
}
export const getAllBlogs = async (req, res) => {
    try {
        let blogs = await Blog.find().populate("user").populate("comment.user");
        res.status(200).json({ blogs })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getBlogById = async (req, res) => {
    let { id } = req.params;
    try {
        let blog = await Blog.findById(id).populate("user").populate("comment.user");
        if (!blog) return res.status(404).json({ message: "blog not found" })
        res.status(200).json({ blog })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const deleteBlog = async (req, res) => {
    let { id } = req.params;
    try {
        let blog = await Blog.findByIdAndDelete(id);
        if (!blog) return res.status(404).json({ message: "blog not found" })
        res.status(200).json({ message: "blog deleted", blog })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const updateBlog = async (req, res) => {
    let { id } = req.params;
    let { title, description, image } = req.body;
    try {
        let blog = await Blog.findByIdAndUpdate(id, { title, description, image }, { new: true });
        if (!blog) return res.status(404).json({ message: "blog not found" })
        res.status(200).json({ message: "blog updated", blog })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
export const addComment = async (req, res) => {
    let { id } = req.params;
    let { user, text } = req.body;
    if (!user || !text) return res.status(400).json({ message: "missing details" })
    try {
        let blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ message: "blog not found" })
        blog.comment.push({ user, text });
        await blog.save();
        res.status(200).json({ message: "comment added", blog })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const deleteComment = async (req, res) => {
    let { blogId, commentId } = req.params;
    try {
        let blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "blog not found" })
        blog.comment = blog.comment.filter(c => c._id.toString() !== commentId);
        await blog.save();
        res.status(200).json({ message: "comment deleted", blog })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const updateComment = async (req, res) => {
    let { blogId, commentId } = req.params;
    let { text } = req.body;
    if (!text) return res.status(400).json({ message: "missing details" })
    try {
        let blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: "blog not found" })
        let comment = blog.comment.find(c => c._id.toString() === commentId);
        if (!comment) return res.status(404).json({ message: "comment not found" })
        comment.text = text;
        await blog.save();
        res.status(200).json({ message: "comment updated", blog })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
export const getComments = async (req, res) => {
    let { id } = req.params;
    try {
        let blog = await Blog.findById(id).populate("comment.user");
        if (!blog) return res.status(404).json({ message: "blog not found" })
        res.status(200).json({ comments: blog.comment })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};
