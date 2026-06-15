import { prisma } from '@/lib/prisma';

export const requirementRelationshipRepository = {
  async create(originRequirementId: string, targetRequirementId: string) {
    return prisma.requirementRelationship.create({
      data: {
        originRequirementId,
        targetRequirementId,
      },
    });
  },

  async findByRequirement(requirementId: string) {
    return prisma.requirementRelationship.findMany({
      where: {
        OR: [
          { originRequirementId: requirementId },
          { targetRequirementId: requirementId },
        ],
      },
      include: {
        originRequirement: true,
        targetRequirement: true,
      },
    });
  },

  async delete(id: string) {
    return prisma.requirementRelationship.delete({
      where: { id },
    });
  },

  async findByRequirements(requirementA: string, requirementB: string) {
    return prisma.requirementRelationship.findFirst({
      where: {
        OR: [
          {
            originRequirementId: requirementA,
            targetRequirementId: requirementB,
          },
          {
            originRequirementId: requirementB,
            targetRequirementId: requirementA,
          },
        ],
      },
    });
  },

  async findById(id: string) {
    return prisma.requirementRelationship.findUnique({
      where: {
        id,
      },
      include: {
        originRequirement: {
          include: {
            project: true,
          },
        },
      },
    });
  },
};
