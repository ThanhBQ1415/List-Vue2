import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { apiError } from '../ultils/apiRespone';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json(apiError('No token provided', 401));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json(apiError('Invalid token', 401));
    }
    // @ts-ignore
    req.user = user;
    next();
  });
}
