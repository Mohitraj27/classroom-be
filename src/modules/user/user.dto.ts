import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupUserDto = z.object({
  firstName: z.string().min(1, "firstName is required").max(40, "firstName must be at most 40 characters long"),
  lastName: z.string().max(80, "lastName must be at most 80 characters long").optional(),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password is required").max(16, "Password must be at most 16 characters long").regex(passwordRegex, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)"),
  confirm_password: z.string().min(8, "Password is required and must be at least 8 characters long").max(16, "Password must be at most 16 characters long"),
  contact_number: z.string().regex(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  userName: z.string().min(1, "userName is required").max(32, "userName must be at most 32 characters long"),
  country: z.string().min(1, "country is required").max(60, "country must be at most 60 characters long"),
  city: z.string().min(1, "city is required").max(50, "city must be at most 50 characters long"),
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

export const forgetPasswordDto = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});

export const resetPasswordDto = z.object({
  new_password: z.string().min(8, "Password is required").regex(passwordRegex, "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&)"),
  confirm_password: z.string().min(8, "Password is required and must be at least 8 characters long"),
}).refine((data)=>{
  return data.new_password === data.confirm_password;
}, {
  message: "Password and confirm password do not match",
  path: ["confirm_password"],
})

export type ResetPasswordInput = z.infer<typeof resetPasswordDto>;
export type ForgetPasswordInput = z.infer<typeof forgetPasswordDto>;
export type LoginUserInput = z.infer<typeof loginUserDto>;
export type CreateUserInput = z.infer<typeof signupUserDto>;
