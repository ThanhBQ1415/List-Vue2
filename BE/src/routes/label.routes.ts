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

// GET /api/labels/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const label = await LabelModel.findOne({ labelId: parseInt(req.params.id) });
    if (!label) return res.status(404).json(apiError('Label not found', 404));
    res.json(apiSuccess(label));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch label'));
  }
});

// POST /api/labels
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) {
      return res.status(400).json(apiError('Name is required', 400));
    }
    const lastLabel = await LabelModel.findOne().sort({ labelId: -1 });
    const labelId = lastLabel?.labelId != null ? lastLabel.labelId + 1 : 1;
    const newLabel = new LabelModel({ labelId, name, color: color || '#cccccc' });
    await newLabel.save();
    res.status(201).json(apiSuccess(newLabel));
  } catch (error) {
    res.status(500).json(apiError('Failed to create label'));
  }
});

// PUT /api/labels/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, color } = req.body;
    const label = await LabelModel.findOneAndUpdate(
      { labelId: parseInt(req.params.id) },
      { $set: { name, color } },
      { new: true }
    );
    if (!label) return res.status(404).json(apiError('Label not found', 404));
    res.json(apiSuccess(label));
  } catch (error) {
    res.status(500).json(apiError('Failed to update label'));
  }
});

// DELETE /api/labels/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const label = await LabelModel.findOneAndDelete({ labelId: parseInt(req.params.id) });
    if (!label) return res.status(404).json(apiError('Label not found', 404));
    res.json(apiSuccess(label, { message: 'Label deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete label'));
  }
});

export default router; 