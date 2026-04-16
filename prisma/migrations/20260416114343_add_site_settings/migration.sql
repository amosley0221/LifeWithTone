-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "bio" TEXT NOT NULL DEFAULT '',
    "profileImage" TEXT
);
