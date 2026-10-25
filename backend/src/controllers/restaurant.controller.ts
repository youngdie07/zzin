import { Request, Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, optionalUserId } from '../middleware/auth.middleware';
import { parseImages, serializeImages } from '../utils/images';
import { withTip } from '../utils/tip';
import { applyEditor } from '../utils/editor';
import { buildProfile, buildHighlights, serializeReview, valueScore, ProfileKey } from '../utils/profile';

// 목록/북마크에서 집계에 필요한 리뷰 필드
const SUMMARY_FIELDS = {
  rating: true,
  noDiscrimination: true,
  authenticity: true,
  palateFit: true,
  priceValue: true,
  crowd: true,
  keywords: true,
  palate: true,
  situations: true,
  menus: true,
  orderTip: true,
  tipReport: true
} as const;

const summarize = (reviews: any[]) => {
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return {
    avgRating: Math.round(avg * 10) / 10,
    profile: buildProfile(reviews),
    highlights: buildHighlights(reviews),
    koreanStats: {
      noDiscriminationCount: reviews.filter((r) => r.noDiscrimination).length,
      totalReviews: reviews.length
    }
  };
};

// 음식점 목록 조회 (검색, 필터링, 정렬)
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const { search, cuisineType, subCuisine, priceBand, sort = 'rating', page = 1, limit = 20 } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { nameKorean: { contains: search as string } },
        { cuisineType: { contains: search as string } },
        { description: { contains: search as string } }
      ];
    }
    if (cuisineType) where.cuisineType = cuisineType;
    if (req.query.includeClosed !== 'true') where.businessStatus = { not: 'closed' };
    if (subCuisine) where.subCuisine = subCuisine;
    if (priceBand) where.priceBand = priceBand;

    const rows = await prisma.restaurant.findMany({
      where,
      include: {
        reviews: { select: SUMMARY_FIELDS },
        _count: { select: { bookmarks: true } }
      }
    });

    const all = rows.map(({ reviews, _count, ...restaurant }) =>
      applyEditor({
        ...withTip(restaurant, reviews),
        images: parseImages(restaurant.images),
        ...summarize(reviews),
        reviewCount: reviews.length,
        bookmarkCount: _count.bookmarks
      })
    ) as any[];

    const profileFilters = (['authenticity', 'palateFit', 'priceValue', 'crowd'] as ProfileKey[]).filter((k) => req.query[k]);
    const keyword = req.query.keyword as string | undefined;
    const situation = req.query.situation as string | undefined;
    const has = (list: { key: string }[], key: string) => list.some((h) => h.key === key);
    const filtered = all
      .filter((r) => req.query.noDiscrimination !== 'true' || r.noDiscrimination)
      .filter((r) => !situation || has(r.highlights.situations, situation))
      .filter((r) => !req.query.palate || has(r.highlights.palate, req.query.palate as string))
      .filter((r) => profileFilters.every((k) => r.profile[k].top === req.query[k]))
      .filter((r) => {
        const t = req.query.tip as string | undefined;
        return !t || (t === 'none' ? r.tip.noTipNeeded : r.tip.policy === t);
      })
      .filter((r) => !keyword || r.highlights.keywords.some((h: any) => h.key === keyword));

    if (sort === 'reviews') filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sort === 'recent') filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    else if (sort === 'saves') filtered.sort((a, b) => b.bookmarkCount - a.bookmarkCount || b.reviewCount - a.reviewCount);
    else if (sort === 'value') filtered.sort((a, b) => valueScore(b.profile) - valueScore(a.profile) || b.reviewCount - a.reviewCount);
    else filtered.sort((a, b) => b.avgRating - a.avgRating || b.reviewCount - a.reviewCount);

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const restaurants = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      restaurants,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limitNum)
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
          include: { user: { select: { id: true, name: true, profileImage: true } } },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { bookmarks: true } }
      }
    });

    if (!restaurant) {
      return res.status(404).json({ error: '음식점을 찾을 수 없습니다.' });
    }

    const { _count, ...rest } = restaurant;

    const me = optionalUserId(req);
    const helped = me
      ? await prisma.reviewHelpful.findMany({ where: { userId: me, reviewId: { in: rest.reviews.map((r) => r.id) } } })
      : [];
    const helpedIds = new Set(helped.map((h) => h.reviewId));

    res.json(
      applyEditor({
        ...withTip(rest, rest.reviews),
        images: parseImages(rest.images),
        reviews: rest.reviews.map((r) => ({ ...serializeReview(r), helpedByMe: helpedIds.has(r.id) })),
        ...summarize(rest.reviews),
        reviewCount: rest.reviews.length,
        bookmarkCount: _count.bookmarks
      })
    );
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: '음식점 조회 중 오류가 발생했습니다.' });
  }
};

// 음식점 생성
export const createRestaurant = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, nameKorean, address, latitude, longitude, phoneNumber,
      cuisineType, subCuisine, priceBand, website, hours, images, description
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
        subCuisine: subCuisine || null,
        priceBand: priceBand || null,
        website,
        hours,
        images: serializeImages(images),
        description
      }
    });

    res.status(201).json({
      message: '음식점이 등록되었습니다.',
      restaurant: { ...restaurant, images: parseImages(restaurant.images) }
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
    const updateData = { ...req.body };
    if (updateData.images !== undefined) updateData.images = serializeImages(updateData.images);

    const restaurant = await prisma.restaurant.update({ where: { id }, data: updateData });

    res.json({
      message: '음식점 정보가 수정되었습니다.',
      restaurant: { ...restaurant, images: parseImages(restaurant.images) }
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

    const existing = await prisma.bookmark.findUnique({
      where: { userId_restaurantId: { userId, restaurantId: id } }
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return res.json({ message: '북마크가 제거되었습니다.', bookmarked: false });
    }

    await prisma.bookmark.create({ data: { userId, restaurantId: id } });
    res.json({ message: '북마크가 추가되었습니다.', bookmarked: true });
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
            reviews: { select: SUMMARY_FIELDS }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(
      bookmarks.map(({ restaurant: { reviews, ...restaurant }, ...bookmark }) => ({
        ...bookmark,
        restaurant: applyEditor({
          ...withTip(restaurant, reviews),
          images: parseImages(restaurant.images),
          ...summarize(reviews),
          reviewCount: reviews.length
        })
      }))
    );
  } catch (error) {
    console.error('Get user bookmarks error:', error);
    res.status(500).json({ error: '북마크 목록 조회 중 오류가 발생했습니다.' });
  }
};
