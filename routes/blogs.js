import express from 'express';

import { getBlogsBySearch, getBlogs, getBlog, createBlog, updateBlog, deleteBlog, likeBlog } from '../controllers/blogs.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/search', getBlogsBySearch);
router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', auth, createBlog);
router.patch('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.patch('/:id/likeBlog', auth, likeBlog);

export default router;