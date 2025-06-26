import { UserRepository } from "./user.repo";
import { CustomError } from "@/utils/custom_error";
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export class UserService {
  constructor(private readonly userRepo = new UserRepository()) {}

  async getUsers() {
    return this.userRepo.getAll();
  }

  async getUser(id: number) {
    const user = await this.userRepo.getById(id);
    console.log(user);
    if (user?.length === 0) {
        console.log("User not found");
      throw new CustomError("User not found", 404);
    }
    return user;
  }


  async deleteUser(id: number) {
    const user = await this.userRepo.getById(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return this.userRepo.delete(id);
  }
  async signupUser(data: { firstName: string; lastName: string; email: string; password: string; confirm_password: string; contact_number: string }) {
      const existingUser = await this.userRepo.getByEmail(data.email);
      if (existingUser?.length > 0) {
        throw new CustomError(messages.USER_ALREADY_EXIST, statusCodes.CONFLICT);
      }
      const hashedPassword = await bcrypt.hash(data.password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS): 10);
        const userData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
          contact_number: data.contact_number
      };
      return this.userRepo.createuser(userData);
  }

  async loginUser(loginData: { email: string; password: string; }) {
    const user = await this.userRepo.getByEmail(loginData.email);
    if (!user || user.length === 0) {
      throw new CustomError(messages.INVALID_CREDENTIALS, statusCodes.UNAUTHORIZED);
    }
    const isPasswordValid = await bcrypt.compare(loginData.password, user[0].password);
    if (!isPasswordValid) {
      throw new CustomError(messages.WRONG_PASSWORD, statusCodes.UNAUTHORIZED);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
    throw new CustomError(messages.JWT_SECRET_NOT_FOUND, statusCodes.INTERNAL_SERVER_ERROR);
    }
    const accessToken = jwt.sign(
      { userId: user[0].id, email: user[0].email },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION || "8h" }
    );
    const { password, ...userWithoutPassword } = user[0];
    return { accessToken, user: userWithoutPassword };
  }
}

