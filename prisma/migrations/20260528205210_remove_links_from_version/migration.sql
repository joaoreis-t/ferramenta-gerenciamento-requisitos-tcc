/*
  Warnings:

  - You are about to drop the column `links` on the `VersaoRequisito` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VersaoRequisito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    CONSTRAINT "VersaoRequisito_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VersaoRequisito" ("createdAt", "description", "id", "priority", "requirementId", "status", "title", "type", "updatedAt") SELECT "createdAt", "description", "id", "priority", "requirementId", "status", "title", "type", "updatedAt" FROM "VersaoRequisito";
DROP TABLE "VersaoRequisito";
ALTER TABLE "new_VersaoRequisito" RENAME TO "VersaoRequisito";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
