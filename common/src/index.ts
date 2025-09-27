import {z} from 'zod';

export const signupInput = z.object({
    email: z.email(),
    name: z.string().min(3).max(100).optional(),
    password: z.string().min(6).max(100)
})

export const signinInput = z.object({
    email: z.email(),
    password: z.string().min(6).max(100)
})

export const createPostInput = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(255).optional(),
    content: z.string().min(3)
})

export const updatePostInput = z.object({
    id: z.uuid(),
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(3).max(255).optional(),
    content: z.string().min(3).optional(),
})

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreatePostInput = z.infer<typeof createPostInput>;
export type UpdatePostInput = z.infer<typeof updatePostInput>;

