import mongoose from 'mongoose';

const blogSchema = mongoose.Schema({
    title: String,
    content: String,
    creator: String,
    tags: [String],
    likes: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var Blog = mongoose.model('Blog', blogSchema);

export default Blog;