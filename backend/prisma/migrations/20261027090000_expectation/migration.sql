-- 기대치 가이드 (high | comfort | casual)
ALTER TABLE "restaurants" ADD COLUMN "editorExpectation" TEXT;
ALTER TABLE "reviews" ADD COLUMN "expectation" TEXT;
