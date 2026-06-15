import { prisma } from '@/lib/prisma';
import {
  TipoRequisito,
  PrioridadeRequisito,
  StatusRequisito,
} from '@/generated/prisma/enums';
import { Prisma } from '@/generated/prisma/client';

export const requirementRepository = {
  async create(data: {
    title: string;
    description: string;
    type: TipoRequisito;
    priority: PrioridadeRequisito;
    status: StatusRequisito;
    links?: Prisma.InputJsonValue;
    projectId: string;
    requirementCode: string;
  }) {
    return prisma.requirement.create({ data });
  },

  async findByProject(projectId: string) {
    return prisma.requirement.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.requirement.findUnique({
      where: { id },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      type: TipoRequisito;
      priority: PrioridadeRequisito;
      status: StatusRequisito;
      links?: Prisma.InputJsonValue;
    }>,
  ) {
    return prisma.requirement.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.requirement.delete({
      where: { id },
    });
  },

  async findLastByProjectAndType(projectId: string, type: TipoRequisito) {
    return prisma.requirement.findFirst({
      where: { projectId, type },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findDetailedById(id: string) {
    return prisma.requirement.findUnique({
      where: { id },
      include: {
        project: true,

        versions: {
          orderBy: {
            createdAt: 'desc',
          },
        },

        originRelations: {
          include: {
            targetRequirement: true,
          },
        },

        targetRelations: {
          include: {
            originRequirement: true,
          },
        },
      },
    });
  },
};
