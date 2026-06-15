import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome muito longo'),
  email: z.string().email('Formato de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
