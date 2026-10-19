-- AlterTable
ALTER TABLE "reviews" ADD COLUMN "tipReport" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameKorean" TEXT,
    "address" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "phoneNumber" TEXT,
    "cuisineType" TEXT NOT NULL,
    "priceRange" INTEGER NOT NULL DEFAULT 2,
    "googlePlaceId" TEXT,
    "website" TEXT,
    "hours" JSONB,
    "images" TEXT,
    "description" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "tipPolicy" TEXT,
    "tipConfidence" REAL,
    "tipEvidence" TEXT,
    "tipCheckedAt" DATETIME,
    "businessStatus" TEXT NOT NULL DEFAULT 'unverified',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_restaurants" ("address", "createdAt", "cuisineType", "description", "googlePlaceId", "hours", "id", "images", "isVerified", "latitude", "longitude", "name", "nameKorean", "phoneNumber", "priceRange", "updatedAt", "website") SELECT "address", "createdAt", "cuisineType", "description", "googlePlaceId", "hours", "id", "images", "isVerified", "latitude", "longitude", "name", "nameKorean", "phoneNumber", "priceRange", "updatedAt", "website" FROM "restaurants";
DROP TABLE "restaurants";
ALTER TABLE "new_restaurants" RENAME TO "restaurants";
CREATE UNIQUE INDEX "restaurants_googlePlaceId_key" ON "restaurants"("googlePlaceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
