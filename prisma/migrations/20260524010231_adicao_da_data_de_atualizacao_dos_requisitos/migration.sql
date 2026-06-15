-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Requirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requirementCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "links" JSONB,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Requirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Requirement" ("createdAt", "description", "id", "links", "priority", "projectId", "requirementCode", "status", "title", "type") SELECT "createdAt", "description", "id", "links", "priority", "projectId", "requirementCode", "status", "title", "type" FROM "Requirement";
DROP TABLE "Requirement";
ALTER TABLE "new_Requirement" RENAME TO "Requirement";
CREATE TABLE "new_VersaoRequisito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "links" JSONB,
    "requirementId" TEXT NOT NULL,
    CONSTRAINT "VersaoRequisito_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_VersaoRequisito" ("createdAt", "description", "id", "links", "priority", "requirementId", "status", "title", "type") SELECT "createdAt", "description", "id", "links", "priority", "requirementId", "status", "title", "type" FROM "VersaoRequisito";
DROP TABLE "VersaoRequisito";
ALTER TABLE "new_VersaoRequisito" RENAME TO "VersaoRequisito";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
