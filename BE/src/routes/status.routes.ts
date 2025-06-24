import express from 'express';
import { StatusModel } from '../models/status.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/statuses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.query;
    let filter: any = {};
    if (projectId) filter.projectId = parseInt(projectId as string);
    let statuses = await StatusModel.find(filter);
    statuses = statuses.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    res.json(apiSuccess(statuses, { total: statuses.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch statuses'));
  }
});

// GET /api/statuses/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const status = await StatusModel.findOne({ statusId: parseInt(req.params.id) });
    if (!status) return res.status(404).json(apiError('Status not found', 404));
    res.json(apiSuccess(status));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch status'));
  }
});

// POST /api/statuses
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, displayOrder, projectId } = req.body;
    if (!name || !projectId) {
      return res.status(400).json(apiError('Name and projectId are required', 400));
    }
    const lastStatus = await StatusModel.findOne().sort({ statusId: -1 });
    const statusId = lastStatus?.statusId != null ? lastStatus.statusId + 1 : 1;
    const newStatus = new StatusModel({ statusId, name, displayOrder, projectId: parseInt(projectId) });
    await newStatus.save();
    res.status(201).json(apiSuccess(newStatus));
  } catch (error) {
    res.status(500).json(apiError('Failed to create status'));
  }
});

// PUT /api/statuses/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, displayOrder, projectId } = req.body;
    const status = await StatusModel.findOneAndUpdate(
      { statusId: parseInt(req.params.id) },
      { $set: { name, displayOrder, projectId: projectId ? parseInt(projectId) : undefined } },
      { new: true }
    );
    if (!status) return res.status(404).json(apiError('Status not found', 404));
    res.json(apiSuccess(status));
  } catch (error) {
    res.status(500).json(apiError('Failed to update status'));
  }
});

// DELETE /api/statuses/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const status = await StatusModel.findOneAndDelete({ statusId: parseInt(req.params.id) });
    if (!status) return res.status(404).json(apiError('Status not found', 404));
    res.json(apiSuccess(status, { message: 'Status deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete status'));
  }
});

export default router; 