import { z } from 'zod';

export const reviewSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  rating: z.number().min(1).max(5),
  review: z.string().min(10, { message: 'Review must be at least 10 characters' }),
});

export const bugSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  type: z.enum(['bug', 'feature']),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type BugInput = z.infer<typeof bugSchema>;
export type LoginInput = z.infer<typeof loginSchema>;