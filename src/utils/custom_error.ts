import { CustomErrorType } from "@/modules/user/user.types";
export class CustomError extends Error implements CustomErrorType {
  public statusCode: number;
  public exactError?: unknown;

  constructor(message: string, statusCode = 500,exactError?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.exactError = exactError;

    Object.setPrototypeOf(this, CustomError.prototype);

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    }

    console.error(this);

    if(exactError){
      console.error('Exact Error:', exactError);
    }
  }
}
