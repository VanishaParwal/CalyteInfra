import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/AuthService';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      username?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const payload = authService.verifyAccessToken(token);
    req.userId = payload.userId;
    req.username = payload.username;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
