import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// 사용자 프로필 조회
export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profileImage: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            bookmarks: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: '사용자 조회 중 오류가 발생했습니다.' });
  }
};

// 프로필 업데이트
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, profileImage, phoneNumber } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        profileImage,
        phoneNumber
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImage: true,
        phoneNumber: true,
        createdAt: true
      }
    });

    res.json({
      message: '프로필이 업데이트되었습니다.',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
};
