import { prisma } from '@/lib/prisma';
import { User } from '@/generated/prisma/client';
import { CreateUserDTO } from '@/dtos/userDto';

export const UserRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  },
};
