import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.mongoose';
import { apiSuccess, apiError } from '../ultils/apiRespone';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// GET /api/users (cần đăng nhập)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(apiSuccess(users, { total: users.length }));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch users'));
  }
});

// GET /api/users/:id (cần đăng nhập)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findOne({ userId: parseInt(req.params.id) });
    if (!user) return res.status(404).json(apiError('User not found', 404));
    res.json(apiSuccess(user));
  } catch (error) {
    res.status(500).json(apiError('Failed to fetch user'));
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { fullName, email, password, avatarUrl } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json(apiError('Full name, email, and password are required', 400));
    }
    const lastUser = await UserModel.findOne().sort({ userId: -1 });
    const userId = lastUser?.userId != null ? lastUser.userId + 1 : 1;
    const newUser = new UserModel({ userId, fullName, email, password, avatarUrl, createdAt: new Date() });
    await newUser.save();
    res.status(201).json(apiSuccess({ userId, fullName, email, avatarUrl, createdAt: newUser.createdAt }));
  } catch (error) {
    res.status(500).json(apiError('Failed to create user'));
  }
});

// PUT /api/users/:id (cần đăng nhập)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { fullName, email, avatarUrl } = req.body;
    const user = await UserModel.findOneAndUpdate(
      { userId: parseInt(req.params.id) },
      { $set: { fullName, email, avatarUrl } },
      { new: true }
    );
    if (!user) return res.status(404).json(apiError('User not found', 404));
    res.json(apiSuccess(user));
  } catch (error) {
    res.status(500).json(apiError('Failed to update user'));
  }
});

// DELETE /api/users/:id (cần đăng nhập)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findOneAndDelete({ userId: parseInt(req.params.id) });
    if (!user) return res.status(404).json(apiError('User not found', 404));
    res.json(apiSuccess(user, { message: 'User deleted successfully' }));
  } catch (error) {
    res.status(500).json(apiError('Failed to delete user'));
  }
});

// Đăng ký (không cần đăng nhập)
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, avatarUrl } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json(apiError('Full name, email, and password are required', 400));
    }
    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json(apiError('Email already exists', 400));
    }
    const lastUser = await UserModel.findOne().sort({ userId: -1 });
    const userId = lastUser?.userId != null ? lastUser.userId + 1 : 1;
    const newUser = new UserModel({ userId, fullName, email, password, avatarUrl, createdAt: new Date() });
    await newUser.save();
    res.status(201).json(apiSuccess({ userId, fullName, email, avatarUrl, createdAt: newUser.createdAt }));
  } catch (error) {
    res.status(500).json(apiError('Failed to register user'));
  }
});

// Đăng nhập (không cần đăng nhập)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json(apiError('Email and password are required', 400));
    }
    const user = await UserModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json(apiError('Invalid email or password', 401));
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.userId,
        email: user.email,
        fullName: user.fullName
      }, 
      JWT_SECRET,
      { expiresIn: '24h' } // Token will expire in 24 hours
    );

    res.json(apiSuccess({
      token,
      user: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    }));
  } catch (error) {
    res.status(500).json(apiError('Failed to login'));
  }
});

export default router; 