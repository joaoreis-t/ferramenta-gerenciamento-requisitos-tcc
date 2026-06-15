'use server';

import { AuthService } from '@/services/authService';
//import { CreateUserDTO } from '@/dtos/userDto';
import { redirect } from 'next/navigation';
import { registerSchema } from '@/lib/zodSchemas';

export type RegisterState = {
  error?: string;
  success?: boolean;
} | null;

export async function registerAction(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const rawData = Object.fromEntries(formData.entries());

  const validatedFields = registerSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const firstError = validatedFields.error.issues[0].message;
    return { error: firstError };
  }

  try {
    await AuthService.register(validatedFields.data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UserAlreadyExists') {
      return { error: 'Este e-mail já está em uso.' };
    }
    return { error: 'Ocorreu um erro inesperado no servidor.' };
  }

  redirect('/login');
}
