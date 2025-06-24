import express from 'express';
import { CommentModel } from '../models/comment.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/comments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { taskId, userId } = req.query;
    let filter: any = {};
    if (taskId) filter.taskId = parseInt(taskId as string);
    if (userId) filter.userId = parseInt(userId as string);
    let comments = await CommentModel.find(filter);
    comments = comments.sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    );
    res.json(apiSuccess(comments, { total: comments.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch comments'));
  }
});

// GET /api/comments/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await CommentModel.findOne({ commentId: parseInt(req.params.id) });
    if (!comment) return res.status(404).json(apiError('Comment not found', 404));
    res.json(apiSuccess(comment));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch comment'));
  }
});

// POST /api/comments
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, userId, taskId } = req.body;
    if (!content || !userId || !taskId) {
      return res.status(400).json(apiError('Content, userId, and taskId are required', 400));
    }
    const lastComment = await CommentModel.findOne().sort({ commentId: -1 });
    const commentId = lastComment?.commentId != null ? lastComment.commentId + 1 : 1;
    const newComment = new CommentModel({ commentId, content, createdAt: new Date(), userId: parseInt(userId), taskId: parseInt(taskId) });
    await newComment.save();
    res.status(201).json(apiSuccess(newComment));
  } catch (error) {
    res.status(500).json(apiError('Failed to create comment'));
  }
});

// PUT /api/comments/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await CommentModel.findOneAndUpdate(
      { commentId: parseInt(req.params.id) },
      { $set: { content } },
      { new: true }
    );
    if (!comment) return res.status(404).json(apiError('Comment not found', 404));
    res.json(apiSuccess(comment));
  } catch (error) {
    res.status(500).json(apiError('Failed to update comment'));
  }
});

// DELETE /api/comments/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await CommentModel.findOneAndDelete({ commentId: parseInt(req.params.id) });
    if (!comment) return res.status(404).json(apiError('Comment not found', 404));
    res.json(apiSuccess(comment, { message: 'Comment deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete comment'));
  }
});

export default router; 