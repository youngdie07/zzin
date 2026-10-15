-- AlterTable
ALTER TABLE "reviews" ADD COLUMN "keywords" TEXT;
ALTER TABLE "reviews" ADD COLUMN "menus" TEXT;

-- CreateTable
CREATE TABLE "review_helpfuls" (
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "reviewId"),
    CONSTRAINT "review_helpfuls_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "review_helpfuls_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
