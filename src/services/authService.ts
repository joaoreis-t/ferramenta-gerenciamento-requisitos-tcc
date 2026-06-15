import { UserRepository } from '@/repositories/userRepository';
import { CreateUserDTO, UserResponseDTO } from '@/dtos/userDto';
import bcrypt from 'bcryptjs';

export const AuthService = {
  async register(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('UserAlreadyExists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };
  },
};
