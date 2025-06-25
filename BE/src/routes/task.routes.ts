import express from 'express';
import { TaskModel } from '../models/task.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

// GET /api/tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { projectId, statusId, assigneeId, creatorId } = req.query;
    let filter: any = {};
    if (projectId) filter.projectId = parseInt(projectId as string);
    if (statusId) filter.statusId = parseInt(statusId as string);
    if (assigneeId) filter.assigneeId = parseInt(assigneeId as string);
    if (creatorId) filter.creatorId = parseInt(creatorId as string);
    const tasks = await TaskModel.find(filter);
    res.json(apiSuccess(tasks, { total: tasks.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch tasks'));
  }
});

// GET /api/tasks/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await TaskModel.findOne({ taskId: parseInt(req.params.id) });
    if (!task) return res.status(404).json(apiError('Task not found', 404));
    res.json(apiSuccess(task));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch task'));
  }
});

// POST /api/tasks
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, dueDate, creatorId, assigneeId, statusId, projectId } = req.body;
    if (!title || !creatorId || !statusId || !projectId) {
      return res.status(400).json(apiError('Title, creatorId, statusId, and projectId are required', 400));
    }
    const lastTask = await TaskModel.findOne().sort({ taskId: -1 });
    const taskId = lastTask?.taskId != null ? lastTask.taskId + 1 : 1;
    const newTask = new TaskModel({
      taskId,
      title,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      createdAt: new Date(),
      creatorId: parseInt(creatorId),
      assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
      statusId: parseInt(statusId),
      projectId: parseInt(projectId),
    });
    await newTask.save();
    res.status(201).json(apiSuccess(newTask));
  } catch (error) {
    res.status(500).json(apiError('Failed to create task'));
  }
});

// PUT /api/tasks/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, startDate, dueDate, assigneeId, statusId } = req.body;
    const task = await TaskModel.findOneAndUpdate(
      { taskId: parseInt(req.params.id) },
      {
        $set: {
          title,
          description,
          startDate: startDate ? new Date(startDate) : undefined,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          assigneeId: assigneeId ? parseInt(assigneeId) : undefined,
          statusId: statusId ? parseInt(statusId) : undefined,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
    if (!task) return res.status(404).json(apiError('Task not found', 404));
    res.json(apiSuccess(task));
  } catch (error) {
    res.status(500).json(apiError('Failed to update task'));
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await TaskModel.findOneAndDelete({ taskId: parseInt(req.params.id) });
    if (!task) return res.status(404).json(apiError('Task not found', 404));
    res.json(apiSuccess(task, { message: 'Task deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete task'));
  }
});

// GET /api/tasks/by-status/:statusId
router.get('/by-status/:statusId', authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.query;
    const statusId = parseInt(req.params.statusId);
    let filter: any = { statusId };
    if (projectId) filter.projectId = parseInt(projectId as string);
    const tasks = await TaskModel.find(filter);
    res.json(apiSuccess(tasks, { total: tasks.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch tasks by statusId'));
  }
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { statusId } = req.body;
    if (!statusId) {
      return res.status(400).json(apiError('statusId is required', 400));
    }
    const task = await TaskModel.findOneAndUpdate(
      { taskId: parseInt(req.params.id) },
      { $set: { statusId: parseInt(statusId), updatedAt: new Date() } },
      { new: true }
    );
    if (!task) return res.status(404).json(apiError('Task not found', 404));
    res.json(apiSuccess(task));
  } catch (error) {
    res.status(500).json(apiError('Failed to update task statusId'));
  }
});

export default router; 