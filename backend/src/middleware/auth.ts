import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user/User';
import { asyncHandler, createError } from './errorHandler';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (if using cookies)
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(createError('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Get user from token
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return next(createError('User not found', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(createError('User account is deactivated', 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(createError('Not authorized to access this route', 401));
  }
});

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(`User role ${req.user.role} is not authorized to access this route`, 403));
    }

    next();
  };
};

export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Check for token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for token in cookies (if using cookies)
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Get user from token
      const user = await User.findByPk(decoded.id);

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (err) {
      // Silently fail for optional auth
    }
  }

  next();
});