/*
  Warnings:

  - A unique constraint covering the columns `[originRequirementId,targetRequirementId]` on the table `RequirementRelationship` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RequirementRelationship_originRequirementId_targetRequirementId_key" ON "RequirementRelationship"("originRequirementId", "targetRequirementId");
