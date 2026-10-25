import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { serializeImages } from '../utils/images';
import { sanitizeTipReport } from '../utils/tip';
import { sanitizeProfile, sanitizeExtras, serializeReview } from '../utils/profile';

// 리뷰 생성
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      restaurantId,
      rating,
      content,
      images,
      tasteRating,
      serviceRating,
      atmosphereRating,
      noDiscrimination
    } = req.body;

    // 음식점 존재 확인
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });

    if (!restaurant) {
      return res.status(404).json({ error: '음식점을 찾을 수 없습니다.' });
    }

    // 이미 리뷰를 작성했는지 확인
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        restaurantId
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: '이미 리뷰를 작성하셨습니다. 수정 기능을 이용해주세요.' });
    }

    // 리뷰 생성
    const review = await prisma.review.create({
      data: {
        userId,
        restaurantId,
        rating: parseFloat(rating),
        content,
        images: serializeImages(images),
        tasteRating: tasteRating ? parseFloat(tasteRating) : null,
        serviceRating: serviceRating ? parseFloat(serviceRating) : null,
        atmosphereRating: atmosphereRating ? parseFloat(atmosphereRating) : null,
        noDiscrimination: noDiscrimination !== false, // 기본값 true
        ...sanitizeProfile(req.body),
        ...sanitizeExtras(req.body),
        ...sanitizeTipReport(req.body)
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            nameKorean: true
          }
        }
      }
    });

    res.status(201).json({
      message: '리뷰가 작성되었습니다.',
      review: serializeReview(review)
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: '리뷰 작성 중 오류가 발생했습니다.' });
  }
};

// 리뷰 수정
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const updateData = req.body;

    // 리뷰 존재 및 권한 확인
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ error: '리뷰를 수정할 권한이 없습니다.' });
    }

    // 리뷰 업데이트
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        ...updateData,
        ...sanitizeProfile(updateData),
        ...sanitizeExtras(updateData),
        ...sanitizeTipReport(updateData),
        images: updateData.images !== undefined ? serializeImages(updateData.images) : review.images,
        rating: updateData.rating ? parseFloat(updateData.rating) : review.rating,
        tasteRating: updateData.tasteRating ? parseFloat(updateData.tasteRating) : review.tasteRating,
        serviceRating: updateData.serviceRating ? parseFloat(updateData.serviceRating) : review.serviceRating,
        atmosphereRating: updateData.atmosphereRating ? parseFloat(updateData.atmosphereRating) : review.atmosphereRating
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });

    res.json({
      message: '리뷰가 수정되었습니다.',
      review: serializeReview(updatedReview)
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: '리뷰 수정 중 오류가 발생했습니다.' });
  }
};

// 리뷰 삭제
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // 리뷰 존재 및 권한 확인
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ error: '리뷰를 삭제할 권한이 없습니다.' });
    }

    await prisma.review.delete({
      where: { id }
    });

    res.json({ message: '리뷰가 삭제되었습니다.' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: '리뷰 삭제 중 오류가 발생했습니다.' });
  }
};

// 사용자의 리뷰 목록 조회
export const getUserReviews = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            nameKorean: true,
            cuisineType: true,
            images: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(reviews.map(serializeReview));
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ error: '리뷰 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 특정 음식점의 리뷰 목록 조회
export const getRestaurantReviews = async (req: Request, res: Response) => {
  try {
    const { restaurantId } = req.params;
    const { sortBy = 'recent', page = 1, limit = 10 } = req.query;

    let orderBy: any = { createdAt: 'desc' };

    if (sortBy === 'rating_high') {
      orderBy = { rating: 'desc' };
    } else if (sortBy === 'rating_low') {
      orderBy = { rating: 'asc' };
    } else if (sortBy === 'helpful') {
      orderBy = { isHelpful: 'desc' };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const reviews = await prisma.review.findMany({
      where: { restaurantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      },
      orderBy,
      skip,
      take: parseInt(limit as string)
    });

    const total = await prisma.review.count({
      where: { restaurantId }
    });

    res.json({
      reviews: reviews.map(serializeReview),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get restaurant reviews error:', error);
    res.status(500).json({ error: '리뷰 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 리뷰 "도움이 됐어요" 토글
export const toggleHelpful = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: '리뷰를 찾을 수 없습니다.' });
    if (review.userId === userId) return res.status(400).json({ error: '내 리뷰에는 누를 수 없어요.' });

    const key = { userId_reviewId: { userId, reviewId: id } };
    const existing = await prisma.reviewHelpful.findUnique({ where: key });
    if (existing) await prisma.reviewHelpful.delete({ where: key });
    else await prisma.reviewHelpful.create({ data: { userId, reviewId: id } });

    const count = await prisma.reviewHelpful.count({ where: { reviewId: id } });
    await prisma.review.update({ where: { id }, data: { isHelpful: count } });

    res.json({ helpful: !existing, count });
  } catch (error) {
    console.error('Toggle helpful error:', error);
    res.status(500).json({ error: '처리 중 오류가 발생했습니다.' });
  }
};
