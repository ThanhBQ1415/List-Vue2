import express from 'express';
import { LabelModel } from '../models/label.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/labels
router.get('/', authMiddleware, async (req, res) => {
  try {
    const labels = await LabelModel.find();
    res.json(apiSuccess(labels, { total: labels.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch labels'));
  }
});



export default router; 