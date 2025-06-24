import express from 'express';
import { ProjectModel } from '../models/project.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { ownerId } = req.query;
    let filter: any = {};
    if (ownerId) filter.ownerId = parseInt(ownerId as string);
    const projects = await ProjectModel.find(filter);
    res.json(apiSuccess(projects, { total: projects.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch projects'));
  }
});

// GET /api/projects/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await ProjectModel.findOne({ id: parseInt(req.params.id) });
    if (!project) return res.status(404).json(apiError('Project not found', 404));
    res.json(apiSuccess(project));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch project'));
  }
});

// POST /api/projects
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, ownerId } = req.body;
    if (!name || !ownerId) {
      return res.status(400).json(apiError('Name and ownerId are required', 400));
    }
    const lastProject = await ProjectModel.findOne().sort({ id: -1 });
    const id = lastProject?.id != null ? lastProject.id + 1 : 1;
    const newProject = new ProjectModel({ id, name, description, ownerId: parseInt(ownerId), createdAt: new Date() });
    await newProject.save();
    res.status(201).json(apiSuccess(newProject));
  } catch (error) {
    res.status(500).json(apiError('Failed to create project'));
  }
});

// PUT /api/projects/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, ownerId } = req.body;
    const project = await ProjectModel.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      { $set: { name, description, ownerId: ownerId ? parseInt(ownerId) : undefined } },
      { new: true }
    );
    if (!project) return res.status(404).json(apiError('Project not found', 404));
    res.json(apiSuccess(project));
  } catch (error) {
    res.status(500).json(apiError('Failed to update project'));
  }
});

// DELETE /api/projects/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await ProjectModel.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!project) return res.status(404).json(apiError('Project not found', 404));
    res.json(apiSuccess(project, { message: 'Project deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete project'));
  }
});

export default router; 