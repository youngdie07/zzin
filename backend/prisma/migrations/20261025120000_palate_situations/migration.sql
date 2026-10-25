-- 한국인 입맛 / 입맛 포인트 / 누구랑(상황) / 주문 팁 추가
ALTER TABLE "reviews" ADD COLUMN "palateFit" TEXT;
ALTER TABLE "reviews" ADD COLUMN "palate" TEXT;
ALTER TABLE "reviews" ADD COLUMN "situations" TEXT;
ALTER TABLE "reviews" ADD COLUMN "orderTip" TEXT;

ALTER TABLE "restaurants" ADD COLUMN "editorPalateFit" TEXT;
ALTER TABLE "restaurants" ADD COLUMN "editorPalate" TEXT;
ALTER TABLE "restaurants" ADD COLUMN "editorOrderTip" TEXT;

-- 기존 리뷰: "한국인 입맛" 체크 -> 입맛 잘 맞아요, "가족 모임" 체크와 키워드(아이 동반/단체/혼밥) -> 누구랑
UPDATE "reviews" SET "palateFit" = 'good' WHERE "koreanFriendly" = 1;
UPDATE "reviews" SET "situations" = (
  SELECT json_group_array(v) FROM (
    SELECT 'family' AS v WHERE "reviews"."goodForFamily" = 1
    UNION ALL
    SELECT value FROM json_each(CASE WHEN json_valid("reviews"."keywords") THEN "reviews"."keywords" ELSE '[]' END)
    WHERE value IN ('kids', 'group', 'solo')
  )
);
UPDATE "reviews" SET "situations" = NULL WHERE "situations" = '[]';
UPDATE "reviews" SET "keywords" = (
  SELECT json_group_array(value) FROM json_each("reviews"."keywords") WHERE value NOT IN ('kids', 'group', 'solo')
) WHERE json_valid("keywords");
UPDATE "reviews" SET "keywords" = NULL WHERE "keywords" = '[]';

ALTER TABLE "reviews" DROP COLUMN "goodForFamily";
ALTER TABLE "reviews" DROP COLUMN "authenticKorean";
ALTER TABLE "reviews" DROP COLUMN "koreanFriendly";

-- 에디터 분류도 같은 규칙으로 옮김
UPDATE "restaurants" SET "editorPalateFit" = 'good'
WHERE json_valid("editorSituations") AND EXISTS (SELECT 1 FROM json_each("restaurants"."editorSituations") WHERE value = 'koreanFriendly');
UPDATE "restaurants" SET "editorSituations" = (
  SELECT json_group_array(v) FROM (
    SELECT CASE value WHEN 'goodForFamily' THEN 'family' ELSE value END AS v
    FROM json_each(CASE WHEN json_valid("restaurants"."editorSituations") THEN "restaurants"."editorSituations" ELSE '[]' END)
    WHERE value IN ('goodForFamily', 'noDiscrimination')
    UNION ALL
    SELECT value FROM json_each(CASE WHEN json_valid("restaurants"."editorKeywords") THEN "restaurants"."editorKeywords" ELSE '[]' END)
    WHERE value IN ('kids', 'group', 'solo')
  )
) WHERE "editorSituations" IS NOT NULL OR "editorKeywords" IS NOT NULL;
UPDATE "restaurants" SET "editorKeywords" = (
  SELECT json_group_array(value) FROM json_each("restaurants"."editorKeywords") WHERE value NOT IN ('kids', 'group', 'solo')
) WHERE json_valid("editorKeywords");
