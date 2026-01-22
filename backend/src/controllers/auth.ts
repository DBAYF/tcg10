import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/user/User';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types/shared';

// Generate JWT token
const generateToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  } as jwt.SignOptions);
};

// Generate refresh token
const generateRefreshToken = (id: number): string => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  } as jwt.SignOptions);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { username, displayName, email, password, preferredGames } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    return next(createError('User already exists with this email or username', 400));
  }

  // Create user
  const user = await User.create({
    username,
    displayName,
    email,
    password,
    preferences: {
      theme: 'system',
      defaultGame: preferredGames[0],
      currency: 'USD',
      notifications: {
        offers: true,
        priceDrops: true,
        followers: true,
        events: true,
        messages: true,
        marketing: false,
      },
      privacy: {
        profileVisibility: 'public',
        collectionVisibility: 'private',
        onlineStatus: true,
        lastActiveVisible: true,
        locationVisible: false,
        messagePermissions: 'anyone',
      },
    },
  });

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const response: ApiResponse = {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
        tradingStats: user.tradingStats,
        createdAt: user.createdAt,
      },
      token,
      refreshToken,
    },
  };

  res.status(201).json(response);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return next(createError('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(createError('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(createError('Account is deactivated', 401));
  }

  // Update last login
  user.lastLoginAt = new Date();
  user.lastLoginIp = req.ip;
  await user.save();

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  const response: ApiResponse = {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
        tradingStats: user.tradingStats,
        lastLoginAt: user.lastLoginAt,
      },
      token,
      refreshToken,
    },
  };

  res.status(200).json(response);
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const response: ApiResponse = {
    success: true,
    message: 'Logged out successfully',
  };

  res.status(200).json(response);
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken: token } = req.body;

  if (!token) {
    return next(createError('Refresh token is required', 400));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;

    // Get user
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return next(createError('Invalid refresh token', 401));
    }

    // Generate new tokens
    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    const response: ApiResponse = {
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    return next(createError('Invalid refresh token', 401));
  }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    // Don't reveal if user exists or not for security
    const response: ApiResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
    return res.status(200).json(response);
  }

  // TODO: Generate reset token and send email
  // For now, just return success message

  const response: ApiResponse = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  };

  res.status(200).json(response);
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError('Validation failed', 400));
  }

  const { token, password } = req.body;

  // TODO: Verify reset token and update password
  // For now, just return success message

  const response: ApiResponse = {
    success: true,
    message: 'Password reset successfully',
  };

  res.status(200).json(response);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findByPk(req.user!.id);

  if (!user) {
    return next(createError('User not found', 404));
  }

  const response: ApiResponse = {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        location: user.location,
        isVerified: user.isVerified,
        role: user.role,
        preferences: user.preferences,
        tradingStats: user.tradingStats,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  };

  res.status(200).json(response);
});
