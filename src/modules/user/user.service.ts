import { UserRepository } from "./user.repo";
import { CustomError } from "@/utils/custom_error";
import messages from "@/enums/common.enum";
import statusCodes from "@/constants/status_codes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { signupUserInput, LoginUserInput, forgetPasswordInput,UserServiceType, resetPasswordInput,approveSignupRequestInput,rejectionSignupRequestInput, UserRole , signupRequestStatus,userFields, answerQuizInput} from "./user.types";
import { sendEmail } from "@/utils/emailService";
import { hashPassword } from "@/utils/password_helper";
import { uploadBufferToS3 } from "@/utils/aws_helper";
import dotenv from "dotenv";
import { Parser } from "@json2csv/plainjs";
import { AssignContentTypeEnum } from "../learning-content/learning-content.types";
import { useTransaction } from "@/utils/dbTranscation";
dotenv.config();
export class UserService implements UserServiceType {
  private readonly userRepo: UserRepository;
  constructor() {
    this.userRepo = new UserRepository();
  }

  async getUsers(page = 1, limit = 100) {
    return useTransaction(async (trx:any) => {
      return this.userRepo.getAll(page, limit, trx);
    });
  }

  async showLearners(page = 1, limit = 100) {
    return useTransaction(async (trx:any) => {
      return this.userRepo.showLearners(page, limit, trx);
    });
  }

  async showTutors(page = 1, limit = 100) {
    return useTransaction(async (trx:any) => {
      return this.userRepo.showTutors(page, limit, trx);
    });
  }

  async showSignupRequests(page = 1, limit = 100) {
    return useTransaction(async (trx:any) => {
      return this.userRepo.showRequests(page, limit, trx);
    });
  }

  async getUser(id: number) {
    return useTransaction(async (trx:any) => {
      const user: any = await this.userRepo.getById(id, trx);
      if (!user || user.length === 0) {
        throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
      }
      return user;
    });
  }

  async deleteUser(id: number) {
    return useTransaction(async (trx:any) => {
      const user = await this.userRepo.getById(id, trx);
      if (!user || user.length === 0) {
        throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
      }
      await this.userRepo.deleteUser(id, trx);
      return { message: messages.USER_DELETED };
    });
  }

  async signupUser(signupData: signupUserInput) {
    return useTransaction(async (trx:any) => {
      const existingUser: any[] = await this.userRepo.getByEmail(signupData.email, trx);
      if (existingUser?.length > 0) {
        throw new CustomError(messages.USER_ALREADY_EXIST, statusCodes.CONFLICT);
      }

      const existingUserName: any[] = await this.userRepo.getUserName(signupData.userName, trx);
      if (existingUserName?.length > 0) {
        throw new CustomError(messages.USERNAME_ALREADY_EXIST, statusCodes.CONFLICT);
      }

      const hashedPassword = await hashPassword(signupData.password);
      const userData: signupUserInput = {
        ...signupData,
        lastName: signupData?.lastName || "",
        password: hashedPassword,
        role: signupData?.role || UserRole.LEARNER,
        status: signupRequestStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.userRepo.createSignupRequest(userData, trx);
      return { message: messages.USER_SIGNUP_SUCCESS };
    });
  }

  async loginUser(loginData: LoginUserInput) {
    return useTransaction(async (trx:any) => {
      const user: any = await this.userRepo.getByEmail(loginData.email, trx);
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
        { userId: user[0].id, email: user[0].email, userName: user[0].userName, role: user[0].role },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRATION || "8h" }
      );
      const { password, ...userWithoutPassword } = user[0];
      return { user: userWithoutPassword, accessToken };
    });
  }

  async forgetPassword(forgetPasswordData: forgetPasswordInput) {
    return useTransaction(async (trx:any) => {
      const user: any = await this.userRepo.getByEmail(forgetPasswordData.email, trx);
      if (!user || user.length === 0) {
        throw new CustomError(messages.INVALID_CREDENTIALS, statusCodes.UNAUTHORIZED);
      }

      const resetToken: string = crypto.randomBytes(32).toString("hex");
      await this.userRepo.setResetToken(user[0].id, { resetToken, updatedAt: new Date() }, trx);

      const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      const htmlBody = `
        <p>Hello ${user[0].firstName || ""},</p>
        <p>Please click on the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <br/>
        <p>Best regards,</p>
      `;
      await sendEmail({
        to: forgetPasswordData.email,
        subject: messages.RESET_PASSWORD_EMAIL_SUBJECT,
        html: htmlBody
      });

      return { message: messages.FORGET_PASSWORD_SUCCESS };
    });
  }

  async resetPassword(resetPasswordData: resetPasswordInput) {
    return useTransaction(async (trx:any) => {
      const user: any = await this.userRepo.checkForResetToken({ resetToken: resetPasswordData.resetToken, new_password: resetPasswordData.new_password }, trx);
      if (!user || user.length === 0) {
        throw new CustomError(messages.INVALID_CREDENTIALS, statusCodes.UNAUTHORIZED);
      }
      const hashedPassword = await hashPassword(resetPasswordData.new_password);
      await this.userRepo.updatePassword(user[0].id, hashedPassword, trx);
      return { message: messages.PASSWORD_RESET_SUCCESS };
    });
  }

  async approveSignupRequest(payload: approveSignupRequestInput) {
    return useTransaction(async (trx:any) => {
      const requestedUser = await this.userRepo.getSignupRequestById(payload.id as number, trx);
      if (!requestedUser || !requestedUser.length) {
        throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
      }

      const approvedUser = requestedUser[0];

      const {
        id: signupId,
        password,
        resetToken,
        status,
        rejectionReason,
        ...rest
      } = approvedUser as any;

      const userToInsert = {
        ...rest,
        password: password,
        role: payload.role,
        createdAt: approvedUser.createdAt || new Date(),
        updatedAt: new Date()
      };

      await this.userRepo.insertUser(userToInsert as signupUserInput, trx);

      // move a sanitized record to history (strip sensitive fields)
      const historyRow = {
        ...rest,
        role: payload.role,
        status: signupRequestStatus.APPROVED,
        createdAt: approvedUser.createdAt,
        updatedAt: new Date()
      };
       delete historyRow.password;
       delete historyRow.resetToken;

      await this.userRepo.moveToHistory(historyRow, trx);

      await this.userRepo.deleteSignupRequest(payload.id as number, trx);

      return { message: "Signup request approved and user created. Please login to continue." };
    });
  }

  async rejectSignupRequest(payload: rejectionSignupRequestInput) {
    return useTransaction(async (trx:any) => {
      const request = await this.userRepo.getSignupRequestById(payload.id as number, trx);
      if (!request || !request.length) {
        throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
      }

      const signupData = request[0];
      const { ...rest } = signupData as any;

      await this.userRepo.moveToHistory({ ...rest,
        status: signupRequestStatus.REJECTED,
        rejectionReason: payload.rejectionReason,
        updatedAt: new Date(),
        createdAt: signupData.createdAt
      }, trx);

      await this.userRepo.deleteSignupRequest(payload.id as number, trx);

      return { message: "Signup request rejected." };
    });
  }
  async updateUserProfile(updatedUser: number, updatedData: Partial<signupUserInput>) {
    return useTransaction(async (trx: any) => {
      if (userFields.userName in updatedData || userFields.email in updatedData || userFields.role in updatedData) {
        throw new CustomError(messages.USERNAME_EMAIL_CANNOT_BE_UPDATED, statusCodes.BAD_REQUEST);
      }
      const user = await this.userRepo.getById(updatedUser, trx);
      if (!user || user.length === 0) {
        throw new CustomError(messages.USER_NOT_FOUND, statusCodes.NOT_FOUND);
      }
      await this.userRepo.updateProfile(updatedUser, updatedData, trx);
      return { ...user[0], ...updatedData, updatedAt: new Date() };
    });
  }
  async myProfile(loggedInUserId: any) {
    return useTransaction(async (trx: any) => {
      const user = await this.userRepo.getById(loggedInUserId as number, trx);
      return { ...user[0], updatedAt: new Date() };
    });
  }
  async exportUserToCSV() {
    return useTransaction(async (trx:any) => {
      const users = await this.userRepo.exportUserToCSV(trx);
      if (!users || users.length === 0) return null;
      const fields = ["id", "firstName", "lastName", "email", "userName", "role", "createdAt", "updatedAt"];
      const json2csv = new Parser({ fields });
      const csv = json2csv.parse(users);
      const buffer = Buffer.from(csv, "utf-8");
      const fileUrl = await uploadBufferToS3(`users_${Date.now()}.csv`, buffer, "exports");
      return fileUrl;
    });
  }

  async getAllAssignedQuizorContent(userId: number, type?: string, itemId?: number) {
    return useTransaction(async (trx: any) => {
      if (!type) {
        const [quizzes, contents] = await Promise.all([
          this.userRepo.getAllAssignedQuizzes(userId, trx),
          this.userRepo.getAllAssignedContents(userId, trx)
        ]);
        return { quizzes, contents };
      }

      if (type.toUpperCase() === AssignContentTypeEnum.QUIZ) {
        if (!itemId) return this.userRepo.getAllAssignedQuizzes(userId, trx);
        return this.userRepo.getAssignedQuiz(userId, itemId, trx);
      } else if (type.toUpperCase() === AssignContentTypeEnum.CONTENT) {
        if (!itemId) return this.userRepo.getAllAssignedContents(userId, trx);
        return this.userRepo.getAssignedContent(userId, itemId, trx);
      }
    });
  }

  async answerQuiz(payload: answerQuizInput) {
    return useTransaction(async (trx:any) => {
      const { quizId, learnerId } = payload;

      const assigned = await this.userRepo.isQuizAssignedToLearner(quizId, learnerId, trx);
      if (!assigned || assigned.length === 0) {
        throw new CustomError(messages.QUIZ_NOT_ASSIGNED, statusCodes.FORBIDDEN);
      }

      const existingSubmission = await this.userRepo.hasAlreadySubmittedQuiz(quizId, learnerId, trx);
      if (existingSubmission && existingSubmission.length > 0) {
        throw new CustomError(messages.QUIZ_ALREADY_SUBMITTED, statusCodes.CONFLICT);
      }

      // repository will create submission + bulk answers within trx
      return await this.userRepo.answerQuiz(payload, trx);
    });
  }
}
