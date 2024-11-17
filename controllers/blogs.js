import express from 'express';
import mongoose from 'mongoose';

import Blog from '../models/blog.js';

const router = express.Router();

export const getBlogs = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await Blog.countDocuments({});

        const blogs = await Blog.find().sort({createdAt: -1}).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: blogs, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getBlogsBySearch = async (req, res) => {
    const { searchQuery } = req.query;
    try {
        const query = new RegExp(searchQuery, 'i');
        const blogs = await Blog.find({ $or: [{ title: query }, { tags: query }] });
        res.json({ data: blogs });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);

        res.status(200).json(blog);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createBlog = async (req, res) => {
    const post = req.body;

    const newBlog = new Blog({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newBlog.save();

        res.status(201).json(newBlog);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, creator, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    const updatedBlog = { creator, content, title, tags, _id: id };

    await Blog.findByIdAndUpdate(id, updatedBlog, { new: true });

    res.json(updatedBlog);
}

export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No blog with id: ${id}`);

    await Blog.findByIdAndRemove(id);

    res.json({ message: "Blog deleted successfully." });
}

export const likeBlog = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const blog = await Blog.findById(id);

    const index = blog.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        blog.likes.push(req.userId);
    } else {
        blog.likes = blog.likes.filter((id) => id !== String(req.userId));
    }
    const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });
    res.status(200).json(updatedBlog);
}

export default router;