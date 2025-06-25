import express from 'express';
import { StatusModel } from '../models/status.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/statuses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const statuses = await StatusModel.find();
    res.json(apiSuccess(statuses, { total: statuses.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch statuses'));
  }
});

export default router; 