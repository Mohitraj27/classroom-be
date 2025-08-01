import { UserRepository } from "./user.repo";
import { CustomError } from "@/utils/custom_error";
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { signupUserInput, LoginUserInput, forgetPasswordInput,UserServiceType, resetPasswordInput} from "./user.types";
import { sendEmail } from "@/utils/emailService";
import { hashPassword } from "@/utils/password_helper";
import dotenv from "dotenv";
dotenv.config();
export class UserService implements UserServiceType {
  constructor(private readonly userRepo = new UserRepository()) {}

  async getUsers(page=1,limit=100) {
    return this.userRepo.getAll(page,limit);
  }

  async showLearners(page =1,limit=100){
    return this.userRepo.showLearners(page,limit);
  }
  async showTutors(page =1,limit=100){
    return this.userRepo.showTutors(page,limit);
  }
  async showSignupRequests(page =1,limit=100){
    return this.userRepo.showRequests(page,limit);
  }
  async getUser(id: number) {
    const user: any = await this.userRepo.getById(id);
    if (user?.length === 0) {
      throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
    }
    return user;
  }


  async deleteUser(id: number) {
    const user = await this.userRepo.getById(id);
    if (user?.length === 0) {
      throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
    }
    return this.userRepo.delete(id);
  }
  async signupUser(signupData: signupUserInput) {
      const existingUser: any[] = await this.userRepo.getByEmail(signupData.email);
      if (existingUser?.length > 0) {
        throw new CustomError(messages.USER_ALREADY_EXIST, statusCodes.CONFLICT);
      }
      const existingUserName: any[] = await this.userRepo.getUserName(signupData.userName);
      if (existingUserName?.length > 0) {
        throw new CustomError(messages.USERNAME_ALREADY_EXIST, statusCodes.CONFLICT);
      }
      const hashedPassword = await hashPassword(signupData.password);
      const userData = {
          ...signupData,
          lastName: signupData?.lastName || "",
          password: hashedPassword,
          resetToken: null,
          createdAt: new Date(),
          updatedAt: new Date()
      };
      await this.userRepo.createuser(userData);
  }

  async loginUser(loginData: LoginUserInput) {
    const user: any = await this.userRepo.getByEmail(loginData.email);
    if (user?.length === 0) {
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
      { userId: user[0].id, email: user[0].email, userName: user[0].userName,role: user[0].role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRATION || "8h" }
    );
    const { password, ...userWithoutPassword } = user[0];
    return { user: userWithoutPassword, accessToken };
  }

  async forgetPassword(forgetPasswordata: forgetPasswordInput) {
    const user: any = await this.userRepo.getByEmail(forgetPasswordata.email);
    if (user?.length === 0) {
      throw new CustomError(messages.INVALID_CREDENTIALS, statusCodes.UNAUTHORIZED);
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new CustomError(messages.JWT_SECRET_NOT_FOUND, statusCodes.INTERNAL_SERVER_ERROR);
    }
    const resetToken: string = crypto.randomBytes(32).toString("hex");
    await this.userRepo.setresetToken(user[0].id,  { resetToken: resetToken, updatedAt: new Date() } );
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // TODO Email Template
    const htmlBody = `
        <p>Hello ${user[0].firstName || ""},</p>
        <p>Please click on the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <br/>
        <p>Best regards,</p>
    `;
     await sendEmail({
          to: forgetPasswordata.email,
          subject: messages.RESET_PASSWORD_EMAIL_SUBJECT,
          html: htmlBody
      });
  }
  async resetPassword(resetPasswordData: resetPasswordInput) {
    const user: any = await this.userRepo.checkforResetToken({ resetToken: resetPasswordData.resetToken , new_password: resetPasswordData.new_password });
    if (user?.length === 0) {
      throw new CustomError(messages.INVALID_CREDENTIALS, statusCodes.UNAUTHORIZED);
    }
    const hashedPassword = await hashPassword(resetPasswordData.new_password);
    await this.userRepo.updatePassword(user[0].id, hashedPassword );
   }
}
