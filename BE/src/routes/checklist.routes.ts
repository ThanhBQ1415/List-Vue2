import express from 'express';
import { ChecklistItemModel } from '../models/checklist-item.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/checklist
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { taskId, isCompleted } = req.query;
    let filter: any = {};
    if (taskId) filter.taskId = parseInt(taskId as string);
    if (isCompleted !== undefined) filter.isCompleted = isCompleted === 'true';
    const items = await ChecklistItemModel.find(filter);
    res.json(apiSuccess(items, { total: items.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch checklist items'));
  }
});

// GET /api/checklist/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await ChecklistItemModel.findOne({ itemId: parseInt(req.params.id) });
    if (!item) return res.status(404).json(apiError('Checklist item not found', 404));
    res.json(apiSuccess(item));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch checklist item'));
  }
});

// POST /api/checklist
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, isCompleted, taskId } = req.body;
    if (!title || !taskId) {
      return res.status(400).json(apiError('Title and taskId are required', 400));
    }
    const lastItem = await ChecklistItemModel.findOne().sort({ itemId: -1 });
    const itemId = lastItem?.itemId != null ? lastItem.itemId + 1 : 1;
    const newItem = new ChecklistItemModel({ itemId, title, isCompleted: !!isCompleted, taskId: parseInt(taskId) });
    await newItem.save();
    res.status(201).json(apiSuccess(newItem));
  } catch (error) {
    res.status(500).json(apiError('Failed to create checklist item'));
  }
});

// PUT /api/checklist/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, isCompleted } = req.body;
    const item = await ChecklistItemModel.findOneAndUpdate(
      { itemId: parseInt(req.params.id) },
      { $set: { title, isCompleted } },
      { new: true }
    );
    if (!item) return res.status(404).json(apiError('Checklist item not found', 404));
    res.json(apiSuccess(item));
  } catch (error) {
    res.status(500).json(apiError('Failed to update checklist item'));
  }
});

// PATCH /api/checklist/:id/toggle
router.patch('/:id/toggle', authMiddleware, async (req, res) => {
  try {
    const item = await ChecklistItemModel.findOne({ itemId: parseInt(req.params.id) });
    if (!item) return res.status(404).json(apiError('Checklist item not found', 404));
    item.isCompleted = !item.isCompleted;
    await item.save();
    res.json(apiSuccess(item));
  } catch (error) {
    res.status(500).json(apiError('Failed to toggle checklist item'));
  }
});

// DELETE /api/checklist/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const item = await ChecklistItemModel.findOneAndDelete({ itemId: parseInt(req.params.id) });
    if (!item) return res.status(404).json(apiError('Checklist item not found', 404));
    res.json(apiSuccess(item, { message: 'Checklist item deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete checklist item'));
  }
});

export default router; 