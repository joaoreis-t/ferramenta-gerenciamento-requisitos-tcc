import { prisma } from '@/lib/prisma';

export const projectRepository = {
  async createProject(data: {
    name: string;
    description?: string;
    userId: string;
  }) {
    return prisma.project.create({ data });
  },

  async findByUser(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
    });
  },
};
