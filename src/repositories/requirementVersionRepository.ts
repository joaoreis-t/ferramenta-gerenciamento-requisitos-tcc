import { prisma } from '@/lib/prisma';
import {
  TipoRequisito,
  PrioridadeRequisito,
  StatusRequisito,
} from '@/generated/prisma/enums';

import { Prisma } from '@/generated/prisma/client';

export const requirementVersionRepository = {
  async create(data: {
    title: string;
    description: string;
    type: TipoRequisito;
    priority: PrioridadeRequisito;
    status: StatusRequisito;
    //links?: Prisma.InputJsonValue;
    requirementId: string;
  }) {
    return prisma.versaoRequisito.create({
      data,
    });
  },

  async findByRequirement(requirementId: string) {
    return prisma.versaoRequisito.findMany({
      where: { requirementId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
