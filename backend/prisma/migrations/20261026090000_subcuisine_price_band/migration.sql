-- 한식 세부 종류, 1인 가격대 (기존 1~4 단계는 추정값이라 옮기지 않고 시트 값으로 다시 채움)
ALTER TABLE "restaurants" ADD COLUMN "subCuisine" TEXT;
ALTER TABLE "restaurants" ADD COLUMN "priceBand" TEXT;
ALTER TABLE "restaurants" DROP COLUMN "priceRange";

-- 폐업 확인된 곳은 목록에서 숨김 (리뷰 기록은 남김)
UPDATE "restaurants" SET "businessStatus" = 'closed' WHERE "name" IN ('Jjim BBQ', 'Chosun Galbi', 'Charm Korean BBQ');
