-- 시트 분류값의 출처 (에디터 / AI 추정) 와 AI 판단 근거
ALTER TABLE "restaurants" ADD COLUMN "editorSource" TEXT;
ALTER TABLE "restaurants" ADD COLUMN "editorAiNote" TEXT;
