import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { UserRepository } from '@/repositories/userRepository';
import { authConfig } from './src/auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'johndoe@gmail.com',
        },
        password: {
          label: 'Senha',
          type: 'password',
          placeholder: '*****',
        },
      },
      authorize: async (credentials) => {
        const { email, password } = credentials;

        const user = await UserRepository.findByEmail(email as string);

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          password as string,
          user.password,
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
