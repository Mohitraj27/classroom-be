import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupUserDto = z.object({
  firstName: z.string().min(1, "firstName is required"),
  lastName: z.string().min(1, "lastName is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password is required").regex(passwordRegex, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)"),
  confirm_password: z.string().min(8, "Password is required and must be at least 8 characters long"),
  contact_number: z.string().regex(/^\d{10}$/, "Contact number must be exactly 10 digits").optional(),
}).refine((data) => {
  return data.password === data.confirm_password;
}, {
  message: "Password and confirm password do not match",
  path: ["confirm_password"],
});

export const loginUserDto = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password is required and must be at least 8 characters long"),
});

export type CreateUserInput = z.infer<typeof signupUserDto>;
