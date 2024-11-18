import { z } from 'zod';

export interface Login {
    email: string;
    password: string;
}

export const loginSchema = z.object({
    email: z.string().email({ message: 'Correo electronico invalido' }),
    password: z.string()
});
