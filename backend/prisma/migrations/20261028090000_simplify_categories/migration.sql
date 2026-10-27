-- 누구랑 단순화: 가족 모임·부모님 모시고 → 단체(group), 데이트 → 친구랑(friends), 차별 없음은 상황에서 뺌
UPDATE "reviews" SET "situations" = (
  SELECT json_group_array(v) FROM (
    SELECT DISTINCT CASE value WHEN 'family' THEN 'group' WHEN 'parents' THEN 'group' WHEN 'date' THEN 'friends' ELSE value END AS v
    FROM json_each("reviews"."situations") WHERE value IN ('family', 'parents', 'date', 'group', 'solo', 'kids')
  )
) WHERE "situations" IS NOT NULL AND json_valid("situations");

UPDATE "restaurants" SET "editorSituations" = (
  SELECT json_group_array(v) FROM (
    SELECT DISTINCT CASE value WHEN 'family' THEN 'group' WHEN 'parents' THEN 'group' WHEN 'date' THEN 'friends' ELSE value END AS v
    FROM json_each("restaurants"."editorSituations") WHERE value IN ('family', 'parents', 'date', 'group', 'solo', 'kids')
  )
) WHERE "editorSituations" IS NOT NULL AND json_valid("editorSituations");

-- 기대치 가이드, 한국인 입맛, 입맛 포인트 제거
ALTER TABLE "restaurants" DROP COLUMN "editorExpectation";
ALTER TABLE "restaurants" DROP COLUMN "editorPalateFit";
ALTER TABLE "restaurants" DROP COLUMN "editorPalate";
ALTER TABLE "reviews" DROP COLUMN "expectation";
ALTER TABLE "reviews" DROP COLUMN "palateFit";
ALTER TABLE "reviews" DROP COLUMN "palate";
