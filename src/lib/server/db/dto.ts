import type { UserType } from "./schema";
import { z } from "zod";

export const createUserDto = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  dob: z.coerce.date().refine((date) => {
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    const monthDiff = now.getMonth() - date.getMonth();


    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
      return age - 1 >= 13;
    }

    return age >= 13;
  }, "Must be at least 13 years old"),
  type: z.enum(["Standard", "FirstResponder", "Dispatcher"] as const),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
