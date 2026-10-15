import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const optionalUserId = (req: Request): string | undefined => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return undefined;
    return (jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string }).userId;
  } catch {
    return undefined;
  }
};
