import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Regex para proteger todas as rotas, EXCETO as que você definir aqui
  // Basicamente: não rode o middleware em arquivos estáticos, imagens e api/auth
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|register).*)'],
};
