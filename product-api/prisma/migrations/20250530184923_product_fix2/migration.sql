/*
  Warnings:

  - You are about to drop the `Produto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Produto";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rate" REAL NOT NULL,
    "count" INTEGER NOT NULL
);
