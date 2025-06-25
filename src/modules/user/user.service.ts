import { UserRepository } from "./user.repo";
import { CustomError } from "@/utils/custom_error";

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

  async createUser(data: { name: string; email: string }) {
    return this.userRepo.create(data);
  }

  async deleteUser(id: number) {
    const user = await this.userRepo.getById(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return this.userRepo.delete(id);
  }
}
