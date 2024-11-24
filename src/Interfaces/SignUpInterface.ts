import { z } from 'zod';

export interface UserData {
    id_usuario?: string;
    nombres?: string;
    apellidos?: string;
    email?: string;
    password?: string;
    psw_hash?: string;
    nick?: string;
    prof_pic?: string;
    calle?: string;
    colonia?: string;
    ciudad?: string;
    pais?: string;
    codigoPostal?: number;
    referencia?: string;
}

export const UserSignUpSchema = z
    .object({
        id_usuario: z.string().optional(),
        nombres: z
            .string()
            .min(1, { message: 'nombre → minimo 1 carácter' })
            .regex(/^[^\s].*[^\s]$/, { message: 'nombre → no puede iniciar o terminar con espacios' }),
        apellidos: z
            .string()
            .min(1, { message: 'apellido → minimo 1 carácter' })
            .regex(/^[^\s].*[^\s]$/, { message: 'apellido → no puede iniciar o terminar con espacios' }),
        email: z
            .string()
            .email({ message: 'correo no válido' })
            .regex(/^\S+$/, { message: 'correo → no se permiten espacios' }), //no se permite un email con espacios
        password: z.string(),
        confirmPassword: z.string(),
        nick: z
            .string()
            .min(1, { message: 'nickname → minimo 1 carácter' })
            .regex(/^[^\s].*[^\s]$/, { message: 'nickname → no puede iniciar o terminar con espacios' }),
        prof_pic: z.string().optional(),
        calle: z.string().optional(),
        colonia: z.string().optional(),
        ciudad: z.string().optional(),
        pais: z.string().optional(),
        codigoPostal: z
            .union([
                z.string().regex(/^\d{5}$/, { message: 'El código postal debe ser un número de 5 dígitos' }),
                z.literal(''), // Permitir cadena vacía sea valido
                z.undefined(), // permitir si no es vacía que sea indefinido
            ])
            .optional(),
        referencia: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'], // Marca en que campo donde se dará el error
    });
