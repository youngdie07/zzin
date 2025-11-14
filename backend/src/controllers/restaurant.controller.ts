import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// 음식점 목록 조회 (검색, 필터링 포함)
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const {
      search,
      cuisineType,
      priceRange,
      minRating,
      tags,
      latitude,
      longitude,
      radius = 10, // km
      page = 1,
      limit = 20
    } = req.query;

    const where: any = {};

    // 검색어 필터링
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { nameKorean: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // 음식 종류 필터링
    if (cuisineType) {
      where.cuisineType = cuisineType;
    }

    // 가격대 필터링
    if (priceRange) {
      where.priceRange = parseInt(priceRange as string);
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        reviews: {
          select: {
            rating: true,
            goodForFamily: true,
            noDiscrimination: true,
            authenticKorean: true,
            koreanFriendly: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            reviews: true,
            bookmarks: true
          }
        }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 평균 평점 계산
    const restaurantsWithRating = restaurants.map(restaurant => {
      const avgRating = restaurant.reviews.length > 0
        ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / restaurant.reviews.length
        : 0;

      // 한국인 맞춤 통계 계산
      const koreanStats = {
        goodForFamilyCount: restaurant.reviews.filter(r => r.goodForFamily).length,
        noDiscriminationCount: restaurant.reviews.filter(r => r.noDiscrimination).length,
        authenticKoreanCount: restaurant.reviews.filter(r => r.authenticKorean).length,
        koreanFriendlyCount: restaurant.reviews.filter(r => r.koreanFriendly).length
      };

      return {
        ...restaurant,
        avgRating: Math.round(avgRating * 10) / 10,
        reviewCount: restaurant._count.reviews,
        bookmarkCount: restaurant._count.bookmarks,
        koreanStats,
        reviews: undefined, // 리뷰 상세는 제거
        _count: undefined
      };
    });

    const total = await prisma.restaurant.count({ where });

    res.json({
      restaurants: restaurantsWithRating,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        totalPages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: '음식점 목록 조회 중 오류가 발생했습니다.' });
  }
};

// 음식점 상세 조회
export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            reviews: true,
            bookmarks: true
          }
        }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: '음식점을 찾을 수 없습니다.' });
    }

    // 평균 평점 계산
    const avgRating = restaurant.reviews.length > 0
      ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / restaurant.reviews.length
      : 0;

    // 한국인 맞춤 통계
    const koreanStats = {
      goodForFamilyCount: restaurant.reviews.filter(r => r.goodForFamily).length,
      noDiscriminationCount: restaurant.reviews.filter(r => r.noDiscrimination).length,
      authenticKoreanCount: restaurant.reviews.filter(r => r.authenticKorean).length,
      koreanFriendlyCount: restaurant.reviews.filter(r => r.koreanFriendly).length,
      totalReviews: restaurant.reviews.length
    };

    res.json({
      ...restaurant,
      avgRating: Math.round(avgRating * 10) / 10,
      koreanStats,
      reviewCount: restaurant._count.reviews,
      bookmarkCount: restaurant._count.bookmarks,
      _count: undefined
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: '음식점 조회 중 오류가 발생했습니다.' });
  }
};

// 음식점 생성
export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      nameKorean,
      address,
      latitude,
      longitude,
      phoneNumber,
      cuisineType,
      priceRange,
      website,
      hours,
      images,
      description
    } = req.body;

    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        nameKorean,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        phoneNumber,
        cuisineType,
        priceRange: priceRange ? parseInt(priceRange) : 2,
        website,
        hours,
        images: images || [],
        description
      }
    });

    res.status(201).json({
      message: '음식점이 등록되었습니다.',
      restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: '음식점 등록 중 오류가 발생했습니다.' });
  }
};

// 음식점 업데이트
export const updateRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: '음식점 정보가 수정되었습니다.',
      restaurant
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: '음식점 수정 중 오류가 발생했습니다.' });
  }
};

// 음식점 북마크
export const toggleBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    // 기존 북마크 확인
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId: id
        }
      }
    });

    if (existingBookmark) {
      // 북마크 제거
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });

      res.json({ message: '북마크가 제거되었습니다.', bookmarked: false });
    } else {
      // 북마크 추가
      await prisma.bookmark.create({
        data: {
          userId,
          restaurantId: id
        }
      });

      res.json({ message: '북마크가 추가되었습니다.', bookmarked: true });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ error: '북마크 처리 중 오류가 발생했습니다.' });
  }
};

// 사용자의 북마크 목록 조회
export const getUserBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        restaurant: {
          include: {
            reviews: {
              select: {
                rating: true
              }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const bookmarksWithRating = bookmarks.map(bookmark => {
      const avgRating = bookmark.restaurant.reviews.length > 0
        ? bookmark.restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / bookmark.restaurant.reviews.length
        : 0;

      return {
        ...bookmark,
        restaurant: {
          ...bookmark.restaurant,
          avgRating: Math.round(avgRating * 10) / 10,
          reviewCount: bookmark.restaurant._count.reviews,
          reviews: undefined,
          _count: undefined
        }
      };
    });

    res.json(bookmarksWithRating);
  } catch (error) {
    console.error('Get user bookmarks error:', error);
    res.status(500).json({ error: '북마크 목록 조회 중 오류가 발생했습니다.' });
  }
};
